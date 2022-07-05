import requests

import logging

log = logging.getLogger(__name__)


def _make_request(url):
    try:
        log.debug("Request: {}".format(url))
        data = requests.get(url)
        if data.status_code == 200:
            print("Request succeed")
            return data.json()
        else:
            print("Request failed")
            log.error(data.text)
            return data.text
    except requests.exceptions.HTTPError as err:
        log.exception(err)
