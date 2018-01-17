<template>
<div>
<h3> citations of {{ $route.params.id }} </h3>

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
	</blockquote>
	<blockquote>
		Note:
		<div class="limwidth">
		<pre v-html="renderNote(item.note)"></pre>
		</div>
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
		test: function (text) {
			console.log(this.bibjson);
		},
		renderBib: function (bibjson) {
			return bibjson2html(bibjson);
		},
		renderNote: function (text) {
			console.log(text);
			return text;
		},
		update: function () {
			var id = this.$route.params.id;
			var vm = this;
			getfiletext(id + '/cites.bib', function (bibs) {
				vm.bibtex = bibs;
				vm.bibjson = bib2json(bibs);
				
				setItems(vm.bibjson, function (item, key, val) {
					vm.$set(item, key, val);
				});
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
	var json = citation_js.get(opts);
	return JSON.parse(json);
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
button {
	display: none;
}

div.limwidth {
	width: 600px;
}

pre {
	white-space: pre-wrap;
}
</style>
