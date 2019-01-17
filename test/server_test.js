var O = require("oolong")
var request = require("fetch-off/request")
var fetchDefaults = require("fetch-defaults")
var URL = "https://uuseakus.rahvaalgatus.ee"
var HEADERS = {headers: {"User-Agent": "Uus Eakus Tests"}}

describe(URL, function() {
	var req = fetchDefaults(request, URL, HEADERS)

	describe("/", function() {
		before(function*() { this.res = yield req("/", {method: "HEAD"}) })

		it("must respond with 200 OK", function() {
			this.res.statusCode.must.equal(200)
		})
	})
	
	;[
		"/assets/default.css"
	].forEach(function(path) {
		describe(path, function() {
			before(function*() {
				this.res = yield req(path, {
					method: "HEAD",
					headers: {"Accept-Encoding": "gzip"}
				})

				this.res.statusCode.must.equal(200)
			})

			it("must have a Cache-Control header", function() {
				var control = this.res.headers["cache-control"]
				control.must.equal("max-age=0, public, must-revalidate")
			})

			it("must not have an Expires header", function() {
				this.res.headers.must.not.have.property("expires")
			})

			it("must have an ETag header", function() {
				this.res.headers.must.have.property("etag")
			})

			// Apache has an issue that if the content is encoded with gzip, the
			// returned ETag has a "-gzip suffix and that breaks futher comparison.
			it("must respond with 304 Not Modified if given ETag", function*() {
				this.res.headers["content-encoding"].must.equal("gzip")

				var etag = this.res.headers.etag
				var res = yield req(path, {
					method: "HEAD",
					headers: {"Accept-Encoding": "gzip", "If-None-Match": etag}
				})

				res.statusCode.must.equal(304)
			})
		})
	})

	O.each({
		"/about": "/rahvakogust/",
		"/effective-ideas": "/ideed/",
		"/effective-ideas/government": "/riiklikult-lahendatavad-ideed/",
		"/effective-ideas/governmental": "/riiklikult-lahendatavad-ideed/"
	}, function(to, from) {
		describe(from, function() {
			before(function*() {
				this.res = yield req(from, {method: "HEAD"})
			})

			it("must redirect to " + to, function() {
				this.res.statusCode.must.equal(301)
				this.res.headers.location.must.equal(URL + to)
			})
		})
	})

	;[
		"/initiatives",
		"/initiatives/42",
	].forEach(function(path) {
		describe(path, function() {
			before(function*() {
				this.res = yield req(path, {method: "HEAD"})
			})

			it("must redirect to Rahvaalgatus", function() {
				this.res.statusCode.must.equal(301)
				this.res.headers.location.must.equal("https://rahvaalgatus.ee" + path)
			})
		})
	})
})

describe("http://uuseakus.rahvaalgatus.ee", function() {
	mustRedirectTo("http://uuseakus.rahvaalgatus.ee", URL)
})

function mustRedirectTo(from, to) {
  var req = fetchDefaults(request, from, HEADERS)

	describe("as a canonical URL", function() {
		describe("/", function() {
			before(function*() { this.res = yield req("/", {method: "HEAD"}) })

			it("must redirect to " + to, function() {
				this.res.statusCode.must.equal(301)
				this.res.headers.location.must.equal(to + "/")
			})
		})

		describe("/foo/bar?42", function() {
			before(function*() {
				this.res = yield req("/foo/bar?42", {method: "HEAD"})
			})

			it("must redirect to same path on " + to, function() {
				this.res.statusCode.must.equal(301)
				this.res.headers.location.must.equal(to + "/foo/bar?42")
			})
		})
	})
}
