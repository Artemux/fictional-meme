<?php

namespace Demo;

use SleepingOwl\Apist\Apist;

class ExApi extends Apist
{
    protected $baseUrl = 'http://ex.ua';
	
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
	
	public function getVideoFiles()
	{
		
		return $this->get('/ru/video/foreign?r=23775', [
				'menus' => Apist::filter('.include_0 td')->each([
					'title'      => Apist::filter('a img')->attr('alt'),
					'link'       => Apist::filter('a')->attr('href'),
				])
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