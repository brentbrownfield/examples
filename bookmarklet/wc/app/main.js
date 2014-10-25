/*jshint strict:false, browser:true */
(function bookmarklet() {
	window.wordCounts = {};
    window.maxCount = 0;

	var wc = function(node) {
		if(!node || node.nodeName === "SCRIPT") return;

		var text = node.textContent;
		var children = node.childNodes;

		if(children) {
			for(var j=0; j < children.length; j++) {
				wc(children[j]);
			}
		}

        if(text) {
            var words = text.split(/\s/g);
            for(var i=0;i< words.length; i++) {
                var word = words[i];
                word = word.trim();

                if(word.length >= 4) {
                    var count = window.wordCounts[word];
                    if ( ! count) {
                        window.wordCounts[word] = 1;
                    } else {
                        window.wordCounts[word]++;
                    }
                    if(window.wordCounts[word] > window.maxCount)
                        window.maxCount = window.wordCounts[word];
                }
            }
        }
	};

    var sort = function() {
        var index = [];
        for (var x in window.wordCounts) {
           index.push({ 'word': x, 'count': window.wordCounts[x]});
        }

        index.sort(function (a, b) {
           var as = a['word'],
               bs = b['word'];

           return as == bs ? 0 : (as > bs ? 1 : -1);
        });
        window.sortedWordCounts = index;
    };

    var displayResults = function() {
        var binsize = window.maxCount/5;
        var bin2 = binsize;
        var bin3 = binsize*2;
        var bin4 = binsize*3;
        var bin5 = binsize*4;

        var newDiv = document.createElement("div");
        newDiv.style.position = "absolute";
        newDiv.style.height = "100%";
        newDiv.style.width = "100%";
        newDiv.style.backgroundColor = "grey";
        newDiv.style.zIndex = "1000";
        newDiv.style.overflow = "auto";

        document.body.insertBefore(newDiv, document.body.firstChild);

        for(var i=0; i<= window.sortedWordCounts.length; i++) {
            var entry = window.sortedWordCounts[i];

            if(!entry) continue;

            var count = entry['count'];
            var word = entry['word'];
            var fontSize;
            if(count <= bin2) {
                fontSize = "1em";
            } else if(count <= bin3) {
                fontSize = "1.25em";
            } else if(count <= bin4) {
                fontSize = "2.5em";
            } else if(count <= bin5) {
                fontSize = "3.5em";
            } else {
                fontSize = "4.5em";
            }

            var wordContainer = document.createElement("span");
            wordContainer.style.fontSize = fontSize;
            wordContainer.style.color = "blue";
            wordContainer.style.padding = "50px 10px 50px 10px";
            var newContent = document.createTextNode(word);
            wordContainer.appendChild(newContent);
            newDiv.appendChild(wordContainer);
        }
    };

	var nodes = document.body.childNodes;

	for(var i=0; i < nodes.length; i++) {
		wc(nodes[i]);
	}

    sort();
	displayResults();
}());
