use_helper Nanoc::Helpers::Rendering

def link_to_unless_current(path)
  attrs = {}
  attrs[:href] = path if @item_rep.path != path
  attrs[:class] = "selected" if @item_rep.path == path
  attrs
end
