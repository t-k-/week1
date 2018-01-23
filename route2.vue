<template>
<div class="limwidth">
<span v-for="item in bibjson">
	<pre v-html="renderBib(item)"></pre>
</span>
</div>
</template>

<script>
module.exports = {
	data: function () {
		return {
			'bibtex': undefined,
			'bibjson': [],
		};
	},
	created: function () {
		this.update();
	},
	methods: {
		isBibfile: function (filename) {
			if (filename.split('.').pop() == 'bib')
				return true;
			else
				return false;
		},
		renderBib: function (bibjson) {
			console.log(bibjson);
			return bibjson2bib(bibjson);
		},
		update: function () {
			var vm = this;
			getfiletext('./all/bib.cat', function (bibs) {
				vm.bibtex = bibs;
				var jjj = bib2json(vm.bibtex);
				vm.bibjson = jjj;
				
				setTimeout(function () {
				setItems(vm.bibjson, function (item,key,val) {
						vm.$set(item, key, val);
				}); }, 500);
			});
		}
	}
};

function setItems(items, callbk) {
	for (var i = 0; i < items.length; i ++) {
		(function () {
			var item = items[i];
			getfiletext(item.id + '/note.txt', function (note) {
				callbk(item, 'note', note);
			});
		}());
	}
}

function bib2json(bibtex) {
	var opts = {format: 'string'};
	opts.type = 'json';
	opts.lang = 'English';
	opts.style = 'csl';
	citation_js.set(bibtex);
	var json1 = JSON.parse(citation_js.get(opts));
	var json2 = bibtexParse.toJSON(bibtex);

	console.log(json1.length);
	console.log(json2.length);

	for (var i = 0; i < json1.length; i++) {
		json1[i].abstract = json2[i].entryTags.abstract || '';
		json1[i].note = '';
	}

	return json1;
}

function bibjson2bib(bibjson) {
	var opts = {format: 'string'};
	opts.type = 'string';
	opts.lang = 'English';
	opts.style = 'bibtex';
	citation_js.set(bibjson);
	return citation_js.get(opts);
}

function getfiletext(path, callbk) {
	$.ajax({
		type : "GET",
		url : "get/" + path,
		contentType: "text/plain",
		dataType: "text",
	}).done(function (text) {
		callbk(text);
	}).fail(function () {
		callbk('');
	});
}

</script>

<style>
li {
	margin-top: 10px;
}
div.limwidth {
	width: 900px;
}
pre {
	white-space: pre-wrap;
}
button {
	display: block;
}
</style>
