require 'bundler/setup'
require 'ember/source'
require 'ember-dev'

%W|examples packages lib|.each do |path|
  map "/#{path}" do
    run Rack::Directory.new(path)
  end
end

run EmberDev::Server.new
