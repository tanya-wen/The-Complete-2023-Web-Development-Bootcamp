exports.getDate = function() {

    let today = new Date();
    //let currentDay = today.getDay();
    /*     if (currentDay === 6 || currentDay === 0) {// saturday or sunday
            day = "weekend"
            //res.send("<h1>Yay, it's the weekend!</h1>");
            //res.sendFile(__dirname + "/weekend.html");
        } else {
            day = "weekday"
    /*         res.write("<p>It is not the weekend</p>");
            res.write("<h1>Boo! I have to work!</h1>");
            res.send(); // res.write can send multiple lines, but res.send is the final send in one go.  */
    // res.sendFile(__dirname + "/weekday.html");
    // }

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    return today.toLocaleDateString("en-US", options);


}



exports.getDay = function() {

    let today = new Date();

    let options = {
        weekday: "long",
    };

    return today.toLocaleDateString("en-US", options);

}