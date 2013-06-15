require 'bundler/setup'
require 'ember-dev'

%W|lib|.each do |path|
  map "/#{path}" do
    run Rack::Directory.new(path)
  end
end

run EmberDev::Server.new
