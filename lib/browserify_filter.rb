class BrowserifyFilter < Nanoc::Filter
  identifier :browserify
	type :binary

  def run(path, params = {})
		args = params[:args] || []

		Kernel.system(
			"./node_modules/.bin/browserify",
			*args,
			"--require", path + (params[:export] ? ":" + params[:export] : ""),
			"--outfile", output_filename
		)
  end
end
