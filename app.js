d3.csv('./regional-global-weekly-2017-06-30--2017-07-07.csv', function(error,data){
  if (error) {
    console.log(error)
  } else {
    console.log(data);
    dataset = data;
  }
});
