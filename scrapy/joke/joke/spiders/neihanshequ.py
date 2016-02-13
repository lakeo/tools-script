# -*- coding: utf-8 -*-
import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from scrapy.http import Response
from joke.items import JokeItem


class NeihanshequSpider(CrawlSpider):
    name = "neihanshequ"
    allowed_domains = ["www.neihanshequ.com"]
    start_urls = (
        'http://www.neihanshequ.com',
        'http://www.neihanshequ.com/pic',
    )

    rules = (
        #Rule(LinkExtractor(allow=r'pic/'), callback='parse_item', follow=True),
    )

    def process_results(self, response, results):
        items = response.xpath('//ul[@id="detail-list"]/li')
        jokes = []
        for i in items:
            joke = JokeItem()
            joke['source'] = response.request.url
            joke['title'] = ''
            joke['content'] = "".join(i.xpath('.//div[@class="upload-txt  no-mb"]//p/text()').extract())
            if not joke['content']:
                joke['content'] = "".join(i.xpath('.//div[@class="upload-txt  "]//p/text()').extract())
            joke['images'] = "".join(i.xpath('.//img[@id="groupImage"]/@data-src').extract())
            joke['like'] = "".join(i.xpath('.//span[@class="digg"]/text()').extract())
            joke['comment'] = "".join(i.xpath('.//span[@class="comment J-comment-count"]/text()').extract())
            joke['unlike'] = "".join(i.xpath('.//span[@class="bury"]/text()').extract())
            joke['view'] = 0
            jokes.append(joke)
        return jokes

    def parse_item(self, response):
        items = response.xpath('//ul[@id="detail-list"]/li')
        jokes = []
        for i in items:
            joke = JokeItem()
            joke['source'] = response.request.url
            joke['title'] = ''
            joke['content'] = "".join(i.xpath('.//div[@class="upload-txt  "]//p/text()').extract())
            joke['images'] = "".join(i.xpath('.//img[@id="groupImage"]/@data-src').extract())
            joke['like'] = "".join(i.xpath('.//span[@class="digg"]/text()').extract())
            joke['comment'] = "".join(i.xpath('.//span[@class="comment J-comment-count"]/text()').extract())
            joke['unlike'] = "".join(i.xpath('.//span[@class="bury"]/text()').extract())
            joke['view'] = 0
            print joke
            jokes.append(joke)

        return jokes
