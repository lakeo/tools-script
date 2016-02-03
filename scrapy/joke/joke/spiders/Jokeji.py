# -*- coding: utf-8 -*-
import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule

from joke.items import JokeItem


class JokejiSpider(CrawlSpider):
    name = 'jokeji'
    allowed_domains = ['jokeji.cn']
    start_urls = ['http://www.jokeji.cn/']

    rules = (
        Rule(LinkExtractor(allow=r'/jokehtml/'), callback='parse_item', follow=True),
    )

    def parse_item(self, response):
        items = response.xpath('//span[@id="text110"]')
        jokes = []
        for i in items:
            joke = JokeItem()
            joke['source'] = response.request.url
            joke['title'] = ''
            joke['content'] = "".join(i.extract())
            joke['images'] = ""
            jokes.append(joke)
            self.logger.info(joke['content'])
        return jokes