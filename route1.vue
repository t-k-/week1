<template>
<div>
<h3> citations of {{ $route.params.id }} </h3>

<ol>
<li v-for="item in bibjson">
	<span v-html="renderBib(item)"></span>
	<blockquote>
		File: http://127.0.0.1:3838/get/root/spectre.pdf
	</blockquote>
	<blockquote>
		Note: {{ item.title }}
	</blockquote>
</li>
</ol>

<button @click="test()">test</button>

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
		test: function () {
			console.log('test');
		},
		renderBib: function (bibjson) {
			return bibjson2html(bibjson);
		},
		update: function () {
			var id = this.$route.params.id;
			var vm = this;
			getfile(id + '/cites.bib', function (bibs) {
				vm.bibtex = bibs;
				vm.bibjson = bib2json(bibs);
				console.log(bibs);
			});
		}
	}
};

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
	var json = citation_js.get(opts);
	return JSON.parse(json);
}

function getfile(path, callbk) {
	$.ajax({
		type : "GET",
		url : "get/" + path,
		contentType: "text/plain",
		dataType: "text",
	}).done(function (text) {
		callbk(text);
	}).fail(function () {
		console.log('bad');
		callbk('');
	});
}
</script>

<style>
li {
  margin-top: 10px;
}
</style>
