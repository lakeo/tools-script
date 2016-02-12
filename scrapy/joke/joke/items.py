# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class JokeItem(scrapy.Item):
    #basic info related
    source = scrapy.Field()

    #content related
    title = scrapy.Field()
    content = scrapy.Field()
    images = scrapy.Field()

    #ugc
    like = scrapy.Field()
    unlike = scrapy.Field()
    comment = scrapy.Field()
    view = scrapy.Field()

