String.prototype.normalize = function(){
  return this.trim().replace(/\s{2,}/g, ' ');
};
