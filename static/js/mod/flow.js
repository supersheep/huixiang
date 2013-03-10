define(function(require,exports){
    function queue(tasks,alldone){
      var currentTask = tasks[0];
        queue.result = queue.result || [];
        function done(result){
            queue.result.push(result);
            tasks.shift();
            queue(tasks,alldone);
        }
        if(tasks.length){
            currentTask(done);
        }else{
            alldone && alldone(queue.result);
        }
    }

    exports.queue = queue
});