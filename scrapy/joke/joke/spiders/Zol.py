# -*- coding: utf-8 -*-
import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule

from joke.items import JokeItem


class ZolSpider(CrawlSpider):
    name = 'zol'
    allowed_domains = ['xiaohua.zol.com.cn']
    start_urls = ['http://xiaohua.zol.com.cn/lengxiaohua/']

    rules = (
        Rule(LinkExtractor(allow=r'/lengxiaohua/'), callback='parse_item', follow=True),
        Rule(LinkExtractor(allow=r'/baoxiao/'), callback='parse_item', follow=True),
        Rule(LinkExtractor(allow=r'/chengren/'), callback='parse_item', follow=True),
        Rule(LinkExtractor(allow=r'/mingzhubaoxiao/'), callback='parse_item', follow=True),
    )

    def parse_item(self, response):
        items = response.xpath('//li[@class="article-summary"]')
        jokes = []
        for i in items:
            joke = JokeItem()
            joke['source'] = response.request.url
            joke['title'] = ''
            joke['content'] = "".join(i.xpath('div[@class="summary-text"]/text()').extract())
            joke['images'] = ''
            jokes.append(joke)
        return jokes
