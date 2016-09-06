
describe('ISY.Events.EventHandler is triggered', function() {
    var eventHandler;

    beforeEach(function(){
        eventHandler = new ISY.Events.EventHandler();
    });

    it('should run its callback', function() {
        var val = 0;

        eventHandler.RegisterEvent("TestEvent", function(newVal){
            val = newVal;
        });

        eventHandler.TriggerEvent("TestEvent", 10);
        expect(val).toEqual(10);
    });

    it('should handle multiple callbacks', function(){
        var firstVal = 0;
        var secondVal = 1;

        eventHandler.RegisterEvent("TestEvent", function(newVal){
            firstVal = newVal;
        });

        eventHandler.RegisterEvent("TestEvent", function(newVal){
            secondVal = newVal;
        });

        eventHandler.TriggerEvent("TestEvent", 10);
        expect(firstVal).toEqual(10);
        expect(secondVal).toEqual(10);
    });
});
