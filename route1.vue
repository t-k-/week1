<template>
<div class="limwidth">
<h3> References of {{ $route.params.id }} </h3>

<ol>
<li v-for="item in bibjson">
	<span v-html="renderBib(item)"></span>

	<blockquote>
		ID: {{ item.id }}
	</blockquote>
	<blockquote v-for="filename in item.filelist">
	File:
		<a target="_blank"
		   :href="'get/' + item.id + '/' + encodeURI(filename)">
		{{ filename }}
		</a>
		<span v-if="isBibfile(filename)">
			[<a target="_blank" :href="'/#/refs/' + item.id">render</a>]
		</span>
	</blockquote>
	<blockquote v-if="item.abstract">
		Abstract:
		<pre v-html="item.abstract"></pre>
	</blockquote>
	<blockquote v-if="item.note != ''">
		Note:
		<pre v-html="item.note"></pre>
	</blockquote>
	<button @click="update()">refresh</button>
</li>
</ol>

</div>
</template>

<script>
module.exports = {
	data: function () {
		return {
			'bibtex': undefined,
			'bibjson': undefined,
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
			return bibjson2html(bibjson);
		},
		update: function () {
			var id = this.$route.params.id;
			var vm = this;
			getfiletext(id + '/cites.bib', function (bibs) {
				vm.bibtex = bibs;
				vm.bibjson = bib2json(bibs);
				
				setTimeout(function () {
					console.log('3 seconds!');
					setItems(vm.bibjson, function (item, key, val) {
						vm.$set(item, key, val);
					});
				}, 500);
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
			getfiletext(item.id + '/cites.txt', function (cites) {
				callbk(item, 'cites_exists', cites);
			});
			getfilelist(item.id, function (ret) {
				callbk(item, 'filelist', ret['filelist']);
			});
		}());
	}
}

function bibjson2html(bibjson) {
	var opts = {format: 'string'};
	opts.type = 'html';
	opts.lang = 'English';
	opts.style = 'citation-harvard1';
	citation_js.set(bibjson);
	return citation_js.get(opts);
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

function getfilelist(id, callbk) {
	$.ajax({
		type : "GET",
		url : "filelist/" + id,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
	}).done(function (jsonlist) {
		callbk(jsonlist);
	}).fail(function () {
		callbk('{}');
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
