# -*- coding: utf-8 -*-
import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from scrapy.http import Response
from joke.items import JokeItem


class QiushiSpider(CrawlSpider):
    name = 'qiushi'
    allowed_domains = ['qiushibaike.com']
    start_urls = ['http://www.qiushibaike.com/',
                  'http://www.qiushibaike.com/imgrank',
                  'http://www.qiushibaike.com/text']

    rules = (
        Rule(LinkExtractor(allow=r'/8hr'), callback='parse_item', follow=True),
        Rule(LinkExtractor(allow=r'/hot'), callback='parse_item', follow=True),
        #Rule(LinkExtractor(allow=r'/imgrank'), callback='parse_item', follow=True),
        Rule(LinkExtractor(allow=r'/text/'), callback='parse_item', follow=True),
        #Rule(LinkExtractor(allow=r'/joke'), callback='parse_item', follow=True),
        #Rule(LinkExtractor(allow=r'/article'), callback='parse_item', follow=True),
    )

    def process_results(self, response, results):
        items = response.xpath('//div[@class="article block untagged mb15"]')
        jokes = []
        for i in items:
            joke = JokeItem()
            joke['source'] = response.request.url
            joke['title'] = ''
            joke['content'] = "".join(i.xpath('div[@class="content"]/text()').extract())
            joke['images'] = ",".join(i.xpath('div[@class="thumb"]//img/@src').extract())
            joke['like'] = "".join(i.xpath('div[@class="stats"]/span[@class="stats-vote"]/i/text()').extract())
            joke['comment'] = "".join(i.xpath('div[@class="stats"]/span[@class="stats-comments"]/a/i/text()').extract())
            joke['unlike'] = 0
            joke['view'] = 0
            jokes.append(joke)
        return jokes

    def skip_item(self,response):
        return []
    ''''
    def parse_article(self,response):
        items = response.xpath('//div[@id="single-next-link"]')
        jokes = []
        for i in items:
            joke = JokeItem()
            joke['source'] = response.request.url
            joke['title'] = ''
            joke['content'] = "".join(i.xpath('div[@class="content"]/text()').extract())
            joke['images'] = "".join(i.xpath('div[@class="thumb"]').extract())
            jokes.append(joke)
            #self.logger.info(str(joke).encode('unicode_escape'))
        return jokes
    '''''

    def parse_item(self, response):
        items = response.xpath('//div[@class="article block untagged mb15"]')
        jokes = []
        for i in items:
            joke = JokeItem()
            joke['source'] = response.request.url
            joke['title'] = ''
            joke['content'] = "".join(i.xpath('div[@class="content"]/text()').extract())
            joke['images'] = ",".join(i.xpath('div[@class="thumb//img/@src"]').extract())
            joke['like'] = "".join(i.xpath('div[@class="stats"]/span[@class="stats-vote"]/i/text()').extract())
            joke['comment'] = "".join(i.xpath('div[@class="stats"]/span[@class="stats-comments"]/a/i/text()').extract())
            joke['unlike'] = 0
            joke['view'] = 0
            jokes.append(joke)
        return jokes
