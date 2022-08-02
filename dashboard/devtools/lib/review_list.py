from pygerrit2 import Anonymous, GerritRestAPI

CONFIG = {
    "rdoproject": "https://review.rdoproject.org/r/",
    "opendev": "https://review.opendev.org/",
    "code.engineering.redhat.com":
        "https://code.engineering.redhat.com/gerrit/"
}


def get_gerrit_meta(url):
    """
    Get gerrit review Metadata
    """
    full_url = url
    if 'rdoproject' in url:
        full_url = CONFIG['rdoproject']
    elif 'opendev' in url:
        full_url = CONFIG['opendev']
    elif 'code.engineering.redhat.com' in url:
        full_url = CONFIG['code.engineering.redhat.com']
    if url.endswith("/"):
        change_id = url.split("/")[-2].strip()
    else:
        change_id = url.split("/")[-1].strip()
    auth = Anonymous()
    rest = GerritRestAPI(url=full_url, auth=auth, verify=False)
    changes = rest.get(f"/changes/{change_id}")
    return changes
