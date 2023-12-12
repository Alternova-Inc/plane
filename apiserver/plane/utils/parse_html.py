from bs4 import BeautifulSoup
from datetime import datetime, timezone
from urllib.parse import urlparse, parse_qs

from django.conf import settings

from plane.utils.s3 import S3


def parse_text_to_html(html, features="html.parser"):
    return BeautifulSoup(html, features)


def refresh_url_content(html):
    refreshed = False

    s3 = S3()
    for img_tag in html.find_all("img"):
        old_src = img_tag["src"]

        if S3.url_file_has_experid(old_src):
            new_url = s3.refresh_url(old_src)
            img_tag["src"] = new_url
            refreshed = True

    return refreshed, str(html)
