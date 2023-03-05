      var arr = [];
      var cost;

      // function by which download the file with .json
      function download(filename, text) {
        var element = document.createElement("a");
        element.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(text)
        );
        element.setAttribute("download", filename);

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      }

      // preview the first file .. (cost.json tells you the cost per unit per channel in rupees)
      function previewFile() {
       
        const [file] = document.getElementById("firstfile").files;
        const reader = new FileReader();

        // this function executes when an object has been loaded.

        reader.onload = function (event) {
         // take / fetch the data of cost.json
          const data = reader.result;

          // parse that data
          const par = JSON.parse(data);

          // to access the cost as cost variable is globally declare.
          cost = par;
          
        };

        if (file) {
            // if file exist then read that file as text..
          reader.readAsText(file);
        }
      }

    // preview the second file.. (channel-cost.json gives you the number of times a channel is used at a given date and time)
      function previewFile2() {
       
        const [file2] = document.getElementById("secondfile").files;

        const reader2 = new FileReader();

        //this function runs when object has been loaded
        reader2.onload = function (event) {
          
          const data2 = reader2.result;

          const par2 = JSON.parse(data2);
         

          // sort the data according to date ( BECAUSE WE WANT TO RESULT IN SORTING ORDER OF DATE..)
          par2.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.date) - new Date(b.date);
          });

          var prvdate = new Date(par2[0].date).toLocaleDateString();
       
          var firsttime = 1;

          // traverse data of second file..
          par2.forEach((element) => {
            var dateStr = new Date(element.date);
            var curdate = dateStr.toLocaleDateString();
            var key;
            var val;

            // this will run for two times (first is entry like sms ,whatsapp etc and second time date )
            // in element there is only two data => {'sms':9,'date':'2022-12-29 09:07:00'}
            for (key1 in element) {
            
              if (element.hasOwnProperty(key1) && key1 !== "date") {
                var value = element[key1];
                key = key1;
                val = value;
              }
            }
           
            if (curdate === prvdate && !firsttime) {
              // I WANT TO UPDATE THE OBJECT IN ARR
             
              // arr[arr.length-1]
              var obj = arr[arr.length - 1];
              if (obj.hasOwnProperty(key)) {

                obj[key] += val * cost[key];
              } else {
               
                obj[key] = val * cost[key];
              }
            } else {
                // make a new obj and push in the array..
              var obj1 = {};
              obj1[key] = val * cost[key];
              obj1["date"] = curdate;
              arr.push(obj1);

              // MAKE A NEW OBJECT THAT HAS BEEN PUSH INTO THE ARRAY.
            }
            firsttime = 0;
            prvdate = curdate;
            });
         // again iterate because we have to round off to atmax 2 digits..
          arr.forEach(a=>{
            for(k in a){
                if (a.hasOwnProperty(k) && k !== "date") {
                    var num = a[k];
                    a[k]=Math.round((num + Number.EPSILON) * 100) / 100
                  }
            }
          })

          var res = JSON.stringify(arr);

          // to download the file in json format with data=res..
          download('test.json',res);
        };

        if (file2) {
          reader2.readAsText(file2);
        }
      }
     
     