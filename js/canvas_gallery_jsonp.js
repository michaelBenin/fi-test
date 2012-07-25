/* 
Canvas Gallery
Michael Benin 2012
*/
/* 	Begin App */
window.fiGallery = (function (w, d) //initialize one global variable
{
	console.log('gallery init');
	
	
	var galleryNum = 0; // for multiple galleries, should begin at 0
	/* 	Constructor */
	function Gallery(data)
	{
		console.log('gallery initialized');
		/* 	Initialize Variables */
		var gallery = this; //define object to access out of scope
		this.data = data;
		this.body = d.getElementsByTagName('body')[0]; // grab the body in a selector that is cached
		this.canvas = gId('canvas');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.canvas2d = this.canvas.getContext('2d'); // grab the canvas and context cached in selector
		
		/* Model */
		this.set = galleryNum; // for new gallery data
		this.imageProperties = [];// used to store the image mapping in gallery for click events
		this.setImage = function(src, obj)
		{
			var o = obj;
			var img = new Image();
			img.onload = function()
			{ 
				gallery.imageProperties.push(o);		
				gallery.images.push(img);
				if(gallery.total !== 0 && gallery.total === gallery.images.length)
				{
					gallery.init();	
				}
			}
			img.src = src;
			
			
		}
		this.images = []; // used to store the actual image objects 
		this.currentx = 10;
		this.currenty = 10;
		this.total = 0;
		this.heightValues = [];
		this.currentImage;
		this.state = 'gallery';
		
		
		
		//filter data
		for(var i in gallery.data) // iterate through the data, some media did not have valid data to compare consecutively
			{
				if (typeof(data[i].entities.media[0]) !== 'undefined')
				{
						gallery.total++;
						var imageObj = 
						{
							title: data[0].entities.hashtags[0].text,
							text: data[i].textdata,
							url: data[i].entities.media[0].media_url_https, 
							sizes: [ 
							[data[i].entities.media[0].sizes.thumb.w, data[0].entities.media[0].sizes.thumb.h],
							[data[i].entities.media[0].sizes.small.w, data[0].entities.media[0].sizes.small.h],
							[data[i].entities.media[0].sizes.medium.w, data[0].entities.media[0].sizes.medium.h],
							[data[i].entities.media[0].sizes.large.w, data[0].entities.media[0].sizes.large.h]
							]
						};
						gallery.setImage(data[i].entities.media[0].media_url_https, imageObj);
				}
			}
		
			
		this.init = function()
		{
			gallery.currentx = 10;
			gallery.currenty = 10;
			gallery.heightValues.length = 0;
			
			for (var i in gallery.imageProperties)
			{
				
				if (Number(i) === 0)
				{
					gallery.imageProperties[i]['map'] = {x:10, y:10, w: gallery.imageProperties[i].sizes[1][0], h:gallery.imageProperties[i].sizes[1][1]};
					gallery.heightValues.push(gallery.imageProperties[i].sizes[1][1]);
					gallery.currentx = gallery.currentx + 10 + gallery.imageProperties[i].sizes[1][0];	
				}
				else if (Number(i) < gallery.imageProperties.length-1)
				{
					if(gallery.currentx + gallery.imageProperties[i].sizes[1][0] >= window.innerWidth)
					{
						gallery.currentx = 10;
						gallery.heightValues.sort();
						gallery.currenty = gallery.currenty + gallery.heightValues[gallery.heightValues.length-1] + 10;
						if(window.innerHeight < gallery.currenty)
						{
							gallery.height = gallery.currenty+gallery.imageProperties[i].sizes[1][1]+10;	
						}
						else if(window.innerHeight > gallery.currenty)
						{
							gallery.height = window.innerHeight;	
						}
						gallery.heightValues.length = 0;
						gallery.imageProperties[i]['map'] = {x:gallery.currentx, y:gallery.currenty, w:gallery.imageProperties[i].sizes[1][0], h:gallery.imageProperties[i].sizes[1][1]};
						gallery.heightValues.push(gallery.imageProperties[i].sizes[1][1]);
						gallery.currentx = gallery.currentx + 10 + gallery.imageProperties[i].sizes[1][0];
						
					}
					else if(gallery.currentx + gallery.imageProperties[i].sizes[1][0] < window.innerWidth)
					{
						gallery.heightValues.push(gallery.imageProperties[i].sizes[1][1]);
						gallery.imageProperties[i]['map'] = {x: gallery.currentx, y: gallery.currenty, w: gallery.imageProperties[i].sizes[1][0], h:gallery.imageProperties[i].sizes[1][1]};
						gallery.currentx = gallery.currentx + 10 + gallery.imageProperties[i].sizes[1][0];
					}
				}
				else if (Number(i) === gallery.imageProperties.length-1)
				{
					if(gallery.imageProperties[i].sizes[1][0] + gallery.currentx > window.innerWidth)
					{
						gallery.currentx = 10;
						gallery.currenty = 10 + gallery.currenty + gallery.imageProperties[i].sizes[1][1];
					}
					gallery.imageProperties[i]['map'] = {x:gallery.currentx, y:gallery.currenty, w:gallery.imageProperties[i].sizes[1][0], h:gallery.imageProperties[i].sizes[1][1]};
					if(window.innerHeight < gallery.currenty)
						{
							gallery.height = gallery.currenty+gallery.imageProperties[i].sizes[1][1]+10;	
						}
						else if(window.innerHeight > gallery.currenty)
						{
							gallery.height = window.innerHeight;	
						}
				}
			}
			setCanvasWidth.call(gallery.canvas, window.innerWidth);
			setCanvasHeight.call(gallery.canvas, gallery.height);
			gallery.canvas2d.fillStyle = 'hsl(255, 255, 255)';
			gallery.canvas2d.fillRect(0, 0, gallery.canvas.width, gallery.canvas.height);
			updateGallery.call(gallery);
		}
		
		//Controller / Views: JS MV*/MVC/MVVC Backbone/Angular/Ember, No thanks, I'll write my own but know how to use them if entering a project	
		this.canvas.addEventListener('click', function(e) 
		{ 
			if(gallery.state === 'gallery')
			{
				gallery.state = 'view';
				gallery.currentImage = collides(gallery.imageProperties, e.clientX, (e.clientY+window.pageYOffset));
				if (gallery.currentImage !== false)
				{
					gallery.canvas2d.fillStyle = 'hsl(255, 255, 255)';
					gallery.canvas2d.fillRect(0, 0, gallery.canvas.width, gallery.canvas.height);
					var x  = (window.innerWidth * .5) - (gallery.imageProperties[gallery.currentImage].sizes[3][0] * .5);
					var y = (window.innerHeight * .5) - (gallery.imageProperties[gallery.currentImage].sizes[3][1] * .5);
					gallery.canvas2d.drawImage(gallery.images[gallery.currentImage], x, y, gallery.imageProperties[gallery.currentImage].sizes[3][0], gallery.imageProperties[gallery.currentImage].sizes[3][1]);
				}
			}
			else if (gallery.state === 'view')
			{
				gallery.state = 'gallery';
				gallery.init();	
			}
		});

		
		this.resize = window.addEventListener('resize', function(e)
		{
			gallery.init();
		});
		
		this.keydown = d.addEventListener('keydown', function (e)
		{
			if (keys[e.keyCode])
			{
				gallery.canvas2d.fillStyle = 'hsl(255, 255, 255)';
				gallery.canvas2d.fillRect(0, 0, gallery.canvas.width, gallery.canvas.height);
				keys[e.keyCode].call(gallery, e);
			}
		});
	}
		
		
		var keys = 
		{
			37: function (e)
			{
				if (this.currentImage !== 0)
				{
					this.currentImage--;
				}
				else if(this.currentImage === 0)
				{
					this.currentImage = this.imageProperties.length-1;	
				}
				var x  = (window.innerWidth * .5) - (this.imageProperties[this.currentImage].sizes[3][0] * .5),
					y = (window.innerHeight * .5) - (this.imageProperties[this.currentImage].sizes[3][1] * .5);
				this.canvas2d.drawImage(this.images[this.currentImage], x, y, this.imageProperties[this.currentImage].sizes[3][0], this.imageProperties[this.currentImage].sizes[3][1]);
			},
			39: function (e)
			{
				if (this.currentImage !== this.imageProperties.length-1)
				{
					this.currentImage++;
				}
				else if(this.currentImage === this.imageProperties.length-1)
				{
					this.currentImage = 0;	
				}
		    	var x  = (window.innerWidth * .5) - (this.imageProperties[this.currentImage].sizes[3][0] * .5);
				var y = 10;//(window.innerHeight * .5) - (this.imageProperties[this.currentImage].sizes[3][1] * .5);
				this.canvas2d.drawImage(this.images[this.currentImage], x, y, this.imageProperties[this.currentImage].sizes[3][0], this.imageProperties[this.currentImage].sizes[3][1]);
			}
		};
	/* Methods */
	//todo: map these functions	in an object
	var updateGallery = function()
	{
		for (var i in this.imageProperties)
			{ 
				this.canvas2d.drawImage(this.images[i], this.imageProperties[i].map.x, this.imageProperties[i].map.y, this.imageProperties[i].map.w, this.imageProperties[i].map.h);
			}
			
	}
	
	function collides(list, x, y) 
	{
		var isCollision = false;
		for (var i = 0, len = list.length; i < len; i++) 
		{
			var left = list[i].map.x, 
				right = list[i].map.x+list[i].map.w,
				top = list[i].map.y, 
				bottom = list[i].map.y+list[i].map.h;
				
			if (right >= x
				&& left <= x
				&& bottom >= y
				&& top <= y) 
			{
				isCollision = i;
			}
		}
		return isCollision;
	}
	
	var gId = function(id)
	{
		return d.getElementById(id);
	}
	
	var setCanvasWidth = function(w)
	{
		this.width = w;
	}
		
	var setCanvasHeight = function(h)
	{
		this.height = h;	
	}
	return{
	gallery: Gallery	
	}
})(window, document);
/* 	End App */


window.addEventListener('load', function (e)
	{
		var script = document.createElement("script");
		script.src = "https://api.twitter.com/1/statuses/media_timeline.json?offset=0&count=100&score=true&is_event=false&filter=false&include_entities=true&user=F_i&callback=fiGallery.gallery";
		document.getElementsByTagName("head")[0].appendChild(script);

		}
	);




/* Google Analytics */ 
(function (d, w)
{
	w._gaq = w._gaq || [];
	_gaq.push(['_setAccount', 'GA ID HERE']);
	_gaq.push(['_trackPageview']);
	var ga, s = d.getElementsByTagName('script')[0];
	ga = d.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = ('https:' == d.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	ga.async = true;
	s.parentNode.insertBefore(ga, s);
})(document, window);
/* End Google Analytics */
/* Facebook API */ (function (d)
{
	var js, id = 'facebook-jssdk',
		ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id))
	{
		return;
	}
	js = d.createElement('script');
	js.id = id;
	js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
})(document);
window.fbAsyncInit = function ()
{
	FB.init(
	{
		appId: '323907284355490', //'YOUR_APP_ID', 
		//channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', 
		status: true,
		cookie: true,
		xfbml: true,
		frictionlessRequests: true
	});
	FB.getLoginStatus(function (response)
	{
		//runFbInitCriticalCode(); 
	});
};
/* End Facebook API */