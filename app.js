d3.csv('regional-global-weekly-2017-06-30--2017-07-07.csv', function(error,data){
			stockData = data.slice(0, 381).filter(function(d){
				if(d["Country"] == "United States"){
					return true;
				}
				return false;
			})
