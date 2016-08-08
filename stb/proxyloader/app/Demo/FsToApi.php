<?php

namespace Demo;

use SleepingOwl\Apist\Apist;

class FsToApi extends Apist
{
    protected $baseUrl = 'http://fs.to';
	
	public function index()
	{
		return $this->get('/', [
			'title' => Apist::filter('.page_head .title')->text()->trim(),
			'menus' => Apist::filter('.menu_text a')->each([
				'title'      => Apist::filter('a')->text(),
				'link'       => Apist::filter('a')->attr('href'),
			])
		]);
	}
	
	public function getVideo()
	{
		
		return $this->get('/ru/video', [
				'menus' => Apist::filter('.include_0 td')->each([
					'title'      => Apist::filter('a')->text(),
					'link'       => Apist::filter('a')->attr('href'),
				])
		]);
		
	}
	
	public function getSeasons()
	{
		
		return $this->get('/video/serials/view/i4qCjhSvjDmiFAbNeccrfTa?play&file=1637365', [
				'seasons' => Apist::filter('.m-season .item li')->each([
					'title'      => Apist::filter('a')->text(),
					'link'       => Apist::filter('a')->attr('href')]),
				'movies' => Apist::filter('.m-dropdown-movie .item li')->each([
					'title'      => Apist::filter('a')->text(),
					'link'       => Apist::filter('a')->attr('href')]),
				'qualitys' => Apist::filter('.m-quality li')->each([
					'title'      => Apist::filter('a')->text(),
					'link'       => Apist::filter('a')->attr('href')]),
				'fileurl' => Apist::filter('.download')->html()
		]);
		
	}

	
	public function getVideoUrl(){
	
		return $this->get('/81774555?r=2,23775', [
				'menus' => Apist::filter('.list td')->each([
					'link'       => Apist::filter('a')->attr('href'),
				])
		]);
		
	}
	
}