# !/usr/bin/env python
# Copyright 2019 Red Hat, Inc.
# All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.

import os
import re

from bs4 import BeautifulSoup
from diskcache import Cache
import os
import tempfile

import requests

cache = Cache("/tmp/skip_cache")
cache.expire()


def get_last_build(tempest_log, tempest_dump_dir=None):
    """
     This function get the zuul job url and tempest latest log url
     and store into cache

     Parameters:
         tempest_log: tempest.html.gz or stestr.result.html file
         or stestr.results.html file
         tempest_dump_dir: temporary directory to store the tempest.html.gz
         or stestr.result.html file

     Return: tempest log url and release name
    """
    if not tempest_dump_dir:
        tempest_dump_dir = tempfile.mkdtemp(prefix="skiplist-")
    file_name = tempest_log.split("/")[-1].strip()
    download_tempest_file(tempest_log, tempest_dump_dir)
    cache.add(tempest_dump_dir, os.path.join(tempest_dump_dir))
    return tempest_dump_dir


def download_tempest_file(url, tempest_dump_dir):
    """
    This function will download the result file with temporary directory

    Parameters:tempest_test_file
    url: The complete tempest log url
    tempest_dump_dir: temporary directory to store the tempest.html.gz
    or stestr.results.html file
    Return: local_filename
    """
    local_filename = url.split('/')[-1]
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(os.path.join(tempest_dump_dir, local_filename), 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
    return local_filename


def parse_html(log_url):
    """
    This function parses the html data in python lists.
    """
    pass_test_cases = []
    fail_test_cases = []
    for file in os.listdir(cache.get(log_url) + "/"):
        if file:
            with open(os.path.join(cache.get(log_url) + "/", file)) as fp:
                soup = BeautifulSoup(fp, "html.parser")
            pass_test_cases = soup.find_all('tr', class_="passClass")
            fail_test_cases = soup.find_all('tr', class_="failClass")
        else:
            raise Exception("File doesn't exist on the given path")
    return (pass_test_cases, fail_test_cases)


def get_pass_tests_name(log_url):
    """
    This function retrieves pass test names from python object and dumps the
    result in json.
    """
    pass_test_cases, fail_test_cases = parse_html(log_url)
    pass_test_cases_names = []
    for test in pass_test_cases:
        td_pass_test_name = test.find_all('td', class_="testname")
        for name in td_pass_test_name:
            filter = re.search("setUpClass ", name.text)
            if filter:
                pass_test_cases_names.append(
                    re.split("setUpClass ", name.text))
            else:
                pass_test_cases_names.append(name.text)
    return pass_test_cases_names


def get_fail_tests_name(log_url):
    """
    This function retrieves fail test names from python object and dumps the
    result in json.
    """
    pass_test_cases, fail_test_cases = parse_html(log_url)
    fail_test_cases_names = []
    for test in fail_test_cases:
        td_fail_test_name = test.find_all('td', class_="testname")
        for name in td_fail_test_name:
            fail_test_cases_names.append(name.text)
    return fail_test_cases_names


def get_status_fail(log_url):
    """
    This function retrieves status of fail test cases
    """
    pass_test_cases, fail_test_cases = parse_html(log_url)
    fail_result = []
    for status in fail_test_cases:
        fail_result.append("Failure")
    return fail_result


def get_status_pass(log_url):
    """
    This function retrieves status of pass test cases
    """
    pass_test_cases, fail_test_cases = parse_html(log_url)
    pass_result = []
    for status in pass_test_cases:
        pass_result.append("Success")
    return pass_result


def combine_status(log_url):
    """
    This function combines the status of failed and passed testcases
    """
    pass_result = get_status_pass(log_url)
    fail_result = get_status_fail(log_url)
    return pass_result + fail_result


def combine_testcases(log_url):
    """
    This function combines the failed and passed testcases names
    """
    pass_test_cases_names = get_pass_tests_name(log_url)
    fail_test_cases_names = get_fail_tests_name(log_url)
    return pass_test_cases_names + fail_test_cases_names


def get_result(log_url, release):
    """
    This function returns the list of testcase name and
    status of the test case
    """
    result = {}
    combine = zip(combine_testcases(log_url), combine_status(log_url))
    test_status = {str(x): str(y) for x, y in combine}
    result[release] = test_status
    return result


def output(log_url, release):
    """
    This function returns the result of parsed data.
    """
    dump_dir = get_last_build(log_url)
    print(dump_dir)
    return get_result(dump_dir, release)


if __name__ == "__main__":
    log_url = "https://logserver.rdoproject.org/openstack-component-network/opendev.org/openstack/tripleo-ci/"
    "master/periodic-tripleo-ci-centos-8-standalone-network-wallaby/bebc93c/logs/undercloud/var/log/tempest/"
    "stestr_results.html.gz"
    print(output(log_url, 'master'))
