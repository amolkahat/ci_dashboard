#!/usr/bin/env python
import os
import sys
from datetime import datetime, timedelta

from launchpadlib.launchpad import Launchpad

cachedir = "{}/.launchpadlib/cache/".format(os.path.expanduser('~'))


def get_bugs(status, tag=None, previous_days=None):
    launchpad = Launchpad.login_anonymously(
        'OOOQ Ruck Rover', 'production', cachedir, version='devel')
    project = launchpad.projects['tripleo']

    # Filter by Status and Tag
    if tag is not None and previous_days is None:
        bugs = project.searchTasks(
            status=status,
            tags=tag)
    # Filter by Status only
    elif tag is None and previous_days is None:
        bugs = project.searchTasks(
            status=status)
    # Filter by Status and Number of Days
    elif tag is None and previous_days is not None:
        days_to_search = datetime.utcnow() - timedelta(days=int(previous_days))
        bugs = project.searchTasks(
            status=status,
            created_since=days_to_search)
    # Filter by Tag, Status and Number of Days
    elif tag is not None and previous_days is not None:
        days_to_search = datetime.utcnow() - timedelta(days=int(previous_days))
        bugs = project.searchTasks(
            status=status,
            created_since=days_to_search,
            tags=tag)
    else:
        print("invalid combination of parameters")
        sys.exit(1)

    return bugs
