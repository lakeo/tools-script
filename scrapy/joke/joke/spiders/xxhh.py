# -*- coding: utf-8 -*-
import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule

from joke.items import JokeItem


class XxhhSpider(CrawlSpider):
    name = 'xxhh'
    allowed_domains = ['www.xxhh.com']
    start_urls = ['http://www.xxhh.com/']

    rules = (
        Rule(LinkExtractor(allow=r'page/'), callback='parse_item', follow=True),
    )

    def parse_item(self, response):
        items = response.xpath('//div[@class="article"]')
        jokes = []
        for i in items:
            joke = JokeItem()
            joke['source'] = response.request.url
            joke['title'] = ''
            joke['content'] = "".join(i.xpath('.//pre/text()').extract())
            imgs= ",".join(i.xpath('.//img/@tsrc').extract())
            if not imgs:
                imgs = ",".join(i.xpath('.//img/@_src').extract())
            joke['images'] = imgs
            joke['like'] = 0
            joke['comment'] = 0
            joke['unlike'] = 0
            joke['view'] = 0
            jokes.append(joke)
        return jokes
