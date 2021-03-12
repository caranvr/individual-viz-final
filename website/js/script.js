mapboxgl.accessToken = 'pk.eyJ1IjoiY2FyYW52ciIsImEiOiJja2s0Z2V6aDIwMmhzMm5udGNkZ2l5cWcyIn0.PVNv_8KPbTaUc9brjHUVGw';

//load a new map into map div
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/caranvr/ckm1vonpp9g7f17qpfu49pxj8',
	center: [-73.9063, 40.7659],
	zoom: 10,
	transition: {
		'duration': 1000,
			'delay': 0
		}
});

//array of months
var months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

map.on('load', function(){

	function setData(month) {

		var layers = ['dropoffs-1', 'dropoffs-2', 'dropoffs-3'];
		var i;
		for (i = 0; i < layers.length; i++) {
			document.getElementById('month').textContent = months[month];				var pp = map.getPaintProperty(layers[i], 'circle-radius');
			pp.property = months[month];
			map.setPaintProperty(layers[i], 'circle-radius', pp);
		}
	}

	//glowy circle layers! 
	//adapted from https://blog.mapbox.com/glow-effect-the-firefly-technique-23eff7297075

	//dropoff layer
	map.addLayer({
		id: 'dropoffs-1',
		type: 'circle',
		source: {
			type: 'vector',
			url: 'mapbox://caranvr.3qxeh2fu'
		},
		'source-layer': 'dropoffs_w_income-blri8q',
		'layout': {
			'visibility': 'visible'
		},
		paint: {
			//change circle radius depending on number of dropoffs
			'circle-radius': {
				property: 'January',
				stops: [
					[0, 0],
					[3, 8],
					[11, 16],
					[32, 32],
					[300, 40]
				]
			},
			'circle-radius-transition': {
				'duration': 1000,
				'delay': 0
			},
			'circle-color': {
				property: 'DO_income',
				stops: [
					[23900, '#450256'],
					[51900, '#3B1C8C'],
					[73900, '#21908D'],
					[102400, '#5AC865'],
					[142300, '#F9E721']
				]
			},
			'circle-blur': 3,
			'circle-opacity': 0.4
		}
	});

			//dropoff glowy layer 2
	map.addLayer({
		id: 'dropoffs-2',
		type: 'circle',
		source: {
			type: 'vector',
			url: 'mapbox://caranvr.3qxeh2fu'
		},
		'source-layer': 'dropoffs_w_income-blri8q',
		'layout': {
			'visibility': 'visible'
		},
		paint: {
			'circle-radius': {
				property: 'January',
				stops: [
					[0, 0],
					[3, 4],
					[11, 8],
					[32, 16],
					[300, 32]
				]
			},
			'circle-radius-transition': {
				'duration': 1000,
				'delay': 0
			},
			'circle-color': {
				property: 'DO_income',
				stops: [
					[23900, '#450256'],
					[51900, '#3B1C8C'],
					[73900, '#21908D'],
					[102400, '#5AC865'],
					[142300, '#F9E721']
				]
			},
			'circle-blur': 3,
			'circle-opacity': 0.4
		}
	});

	map.addLayer({
		id: 'dropoffs-3',
		type: 'circle',
		source: {
			type: 'vector',
			url: 'mapbox://caranvr.3qxeh2fu'
		},
		'source-layer': 'dropoffs_w_income-blri8q',
		'layout': {
			'visibility': 'visible'
		},
		paint: {
			'circle-radius': {
				property: 'January',
				stops: [
					[0, 0],
					[3, 0.8],
					[11, 1.6],
					[32, 3],
					[300, 6]
				]
			},
			'circle-radius-transition': {
				'duration': 1000,
				'delay': 0
			},
			'circle-color': '#fff',
			'circle-blur': 1,
			'circle-opacity': 1
		}
	});

	document.getElementById('slider').addEventListener('input', function(e) {
		var month = parseInt(e.target.value);
		setData(month);
	});

	//filtering by income 
	//adapted from https://docs.mapbox.com/help/tutorials/show-changes-over-time/
	document.getElementById('filters').addEventListener('change', function(e) {
		var inc = e.target.value;
			  // update the map filter
		if (inc === 'all') {
			filterInc = ['<=', ['get', 'DO_income'], 250000];
		} else if (inc === 'low') {
			filterInc = ['all',
			  	['>=', ['get', 'DO_income'], 23900],
			  	['<', ['get', 'DO_income'], 51900]
			  	];
		} else if (inc === 'low-middle') {
			filterInc = ['all',
			  	['>=', ['get', 'DO_income'], 51900],
			  	['<', ['get', 'DO_income'], 73900]
			  	];
		} else if (inc === 'middle') {
			filterInc = ['all',
			  	['>=', ['get', 'DO_income'], 73900],
			  	['<', ['get', 'DO_income'], 102400]
			  	]; 
		} else if (inc === 'high-middle') {
			 filterInc = ['all',
			  	['>=', ['get', 'DO_income'], 102400],
			  	['<', ['get', 'DO_income'], 142300]
			  	]; 
		} else if (inc === 'high') {
			 filterInc = ['>=', ['get', 'DO_income'], 142300];
		} else {
			    console.log('error');
			  }
		console.log(filterInc);
		map.setFilter('dropoffs-1', ['all', filterInc]);
		map.setFilter('dropoffs-2', ['all', filterInc]);
		map.setFilter('dropoffs-3', ['all', filterInc]);
	});

	//add legend
	//adapted from https://docs.mapbox.com/help/tutorials/choropleth-studio-gl-pt-2/
	var layers = ['23,900 – 51,900', '51,900 – 73,900', '73,900 – 102,400', '102,400 – 142,300', '142,300+'];
	var colors = ['#450256', '#3B1C8C', '#21908D', '#5AC865', '#F9E721'];

	for (i = 0; i < layers.length; i++) {
		var layer = layers[i];
		var color = colors[i];
		var item = document.createElement('div');
		var key = document.createElement('span');
		key.className = 'legend-key';
		key.style.backgroundColor = color;

		var value = document.createElement('span');
		value.innerHTML = layer;
		item.appendChild(key);
		item.appendChild(value);
		legend.appendChild(item);
	}

	setData(0);

});

	//popup for about page
	//adapted from https://codepen.io/adrienlochon/pen/Jgjrx
	$ = function(id) {
		return document.getElementById(id);
	}

	var show = function(id) {
		$(id).style.display = 'block';
	}

	var hide = function(id) {
		$(id).style.display = 'none';
	}
