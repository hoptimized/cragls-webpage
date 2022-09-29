
//---------------------------------------------------------------------------------------
// Helpers/Setup

	var scrollElement = document.scrollingElement || document.documentElement;

	var buildThresholdList = function(steps) {
		let thresholds = [];
		for (let i=0; i<=100; i++) {
			thresholds.push(1.0/steps * i);
		}
		return thresholds;
	}

//---------------------------------------------------------------------------------------
//Cross-browser easeInOut function

	Math.easeInOutQuad = function (t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2*t*t + b;
		t--;
		return -c/2 * (t*(t-2) - 1) + b;
	};

//---------------------------------------------------------------------------------------
//Smooth Scroll

	var scrollTo = function(element, to, duration) {
		let start = element.scrollTop,
		change = to - start,
		currentTime = 0,
		increment = 20;
		let animateScroll = function() {        
			currentTime += increment;
			let val = Math.easeInOutQuad(currentTime, start, change, duration);
			element.scrollTop = val;
			if(currentTime < duration) setTimeout(animateScroll, increment);
		};
		animateScroll();
	};

//---------------------------------------------------------------------------------------
//Parallax effect

	window.addEventListener('scroll', function(e) {
		document.querySelectorAll('.parallax').forEach(function(target){
			if (target.getBoundingClientRect().top > window.innerHeight || target.getBoundingClientRect().bottom < 0) return;
			target.style['background-position-y'] = (target.getBoundingClientRect().top * (target.getAttribute('intensity') || 0.2)) + 'px';
		});
	});

//---------------------------------------------------------------------------------------
//Banner Blur effect

	window.addEventListener('scroll', function(e) {
		let ratio = scrollElement.scrollTop / window.innerHeight
		let targets = document.querySelectorAll('.headerBlur');
		targets.forEach(function(target){
			target.style['filter'] = 'blur(' + (12*ratio) + 'px) saturate(' + (1-0.5*ratio) + ') brightness(' + (1+ratio) + ')';
		});
	});

//---------------------------------------------------------------------------------------
//smooth scrolling for internal page links

	let internalLinks = document.querySelectorAll('a[href*="#"]');
	for (let i=0; i<internalLinks.length; i++) {
		internalLinks[i].addEventListener('click', function(e) {
			e.preventDefault();

			let res = document.querySelectorAll(this.hash);
			if (res.length == 0) return;

			let targetElement = res[0];
			let targetTop = targetElement.getBoundingClientRect().top + scrollElement.scrollTop;
			//console.log(targetElement.id + ': ' + targetTop + '/' + (targetTop + scrollElement.scrollTop));
			scrollTo(scrollElement, targetTop, 500);
		});
	}

//---------------------------------------------------------------------------------------
//carousel (aka 'slider') - this should be a react widget

	var sliderTemplate = '';
	sliderTemplate += '	<div class="slider">';
	sliderTemplate += '		<div class="sliderContent">';
	sliderTemplate += '		</div>';
	sliderTemplate += '		<div class="sliderButton sliderButtonLeft">';
	sliderTemplate += '			<a class="hoverZoom">';
	sliderTemplate += '				<img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/images/arrowRight.png" alt="arrow">';
	sliderTemplate += '			</a>';
	sliderTemplate += '		</div>';
	sliderTemplate += '		<div class="sliderButton sliderButtonRight">';
	sliderTemplate += '			<a class="hoverZoom">';
	sliderTemplate += '				<img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/images/arrowRight.png" alt="arrow">';
	sliderTemplate += '			</a>';
	sliderTemplate += '		</div>';
	sliderTemplate += '	</div>';

	var sliderPath = 'https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/';
	var sliderContainer = '#photoSlider';
	var currentSlide = 0;

	// ########################## //
	// ########### TODO ######### //
	// ########################## //

	// generalize the lazy-loading logic for the entire container; 
	// add lazy loading for individual slides --> mutationObserver?
	// not ready for multiple sliders

	let updateSlider = function() {
		let sliderWidth = document.querySelector(sliderContainer + ' .sliderContent').parentElement.getBoundingClientRect().width;
		let newOffset = -sliderWidth * currentSlide;
		document.querySelector(sliderContainer + ' .sliderContent').style['left'] = newOffset + 'px';
	}
	let slide = function(right) {
		let numOfSlides = document.querySelectorAll(sliderContainer + ' .slideWrapper').length;
		currentSlide = Math.min(Math.max(currentSlide + (right ? 1 : -1), 0), numOfSlides - 1);
		updateSlider();
	};
	window.addEventListener('resize', function(e) {
		updateSlider();
	});

	let carouselObserver = new IntersectionObserver(function(entries,observer){
		entries.forEach(function(entry) {

			//if object is visible (for the first time)
			if (entry.isIntersecting) {
				entry.target.innerHTML = sliderTemplate;

				document.querySelector(sliderContainer + ' .sliderButtonLeft a').addEventListener('click', function(e) {
					slide(false);
				});
				document.querySelector(sliderContainer + ' .sliderButtonRight a').addEventListener('click', function(e) {
					slide(true);
				});

				// disabled automatic loading due to github and git lfs not supporting directory indexing; 
				// added hard-coded paths instead.

				/*let xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState != 4) return;

					if (this.status == 200) {
						let parser = new DOMParser();
						let doc = parser.parseFromString(this.responseText, "text/html");
						doc.querySelectorAll('a[href*="png"], a[href*="jpg"]').forEach(function(target) {
							let imageSrc = target.getAttribute("href");
							entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="' + sliderPath + imageSrc + '" /></div></div></div>';
						});

					} else {
						var err = eval("(" + this.responseText + ")");
						console.log(err);
					}
				};
				xhttp.open('GET', sliderPath, true);
				xhttp.send();*/

				// hard-coded:
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/001.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/002.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/003.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/004.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/005.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/006.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/007.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/008.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/009.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/010.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/011.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/012.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/013.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/014.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/016.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/017.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/018.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/019.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/020.jpg" /></div></div></div>';
				entry.target.querySelector('.sliderContent').innerHTML += '<div class="slideWrapper"><div class="illustration"><div><img src="https://media.githubusercontent.com/media/hoptimized/cragls-webpage/main/docs/slider/021.jpg" /></div></div></div>';

				observer.unobserve(entry.target);
			}
		});
	}, {});

	document.querySelectorAll('.carousel').forEach(function(target){
		carouselObserver.observe(target);
	});
	
//---------------------------------------------------------------------------------------
//responsive menu

	let bShowMenu = false;
	window.addEventListener('click', function(e) {
		if (window.innerWidth <= 767) {
			if (e.target.id == 'nav-toggle') {
				e.preventDefault();
				bShowMenu = bShowMenu ? false : true;
			} else {
				bShowMenu = false;
			}

			document.querySelectorAll('#navBar li').forEach(function(t){
				t.style['display'] = bShowMenu ? 'block' : 'none';
			});
		}
	});
	window.addEventListener('resize', function(e) {
		if (window.innerWidth > 767) {
			document.querySelectorAll('#navBar li').forEach(function(t){ t.style['display'] = 'block'; });
		} else {
			document.querySelectorAll('#navBar li').forEach(function(t){ t.style['display'] = bShowMenu ? 'block' : 'none'; });
		}
	});