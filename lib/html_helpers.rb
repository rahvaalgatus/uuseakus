use_helper Nanoc::Helpers::Rendering

def link_to_unless_current(path)
  attrs = {}
  attrs[:href] = path if @item_rep.path != path
  attrs[:class] = "selected" if @item_rep.path == path
  attrs
end

def escape_json(json)
  json = json.gsub(/<\//, "<\\/")
  json = json.gsub(/\u2028/, "\\u2028")
  json = json.gsub(/\u2029/, "\\u2029")
  json
end
