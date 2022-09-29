let observer = new IntersectionObserver(function(entries,observer){
	entries.forEach(function(entry) {

		//if object is visible (for the first time)
		if (entry.isIntersecting) {

			if (entry.target.nodeName == 'IFRAME') {

				//iframes are straight forward
				entry.target.setAttribute('src', entry.target.getAttribute('data-src'));

			} else {

				//get new image src
				let newSrc = entry.target.getAttribute('data-src');

				let preLoadImage = new Image();
				preLoadImage.onload = function() {

					//in here: replace the src/url after download has completed

					if (entry.target.nodeName == 'IMG') {

						//img
						entry.target.setAttribute('src', newSrc);

					} else if (entry.target.classList.contains('lazy')) {

						//css background
						entry.target.style['background-image'] = 'url("' + newSrc + '")';
						entry.target.classList.remove('lazy');

					}

				};

				//start downloading
				preLoadImage.src = newSrc;
			} 

			observer.unobserve(entry.target);
		}
	});
}, {});

let targets = document.querySelectorAll('[data-src], .lazy');
targets.forEach(function(target){
	observer.observe(target);
});