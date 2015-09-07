package controllers;

import play.*;
import play.mvc.*;

import views.html.*;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Set;

import static org.reflections.ReflectionUtils.getAllMethods;
import static org.reflections.ReflectionUtils.withReturnType;

public class Application extends Controller {

    public Result index() {
        return ok(index.render());
    }

    public Result javascriptRoutes() throws IllegalAccessException, IllegalArgumentException,
            InvocationTargetException {

        // use reflection to get the fields of controllers.routes.javascript and other controller packages
        Set<Object> reverseRoutes = new HashSet<>();
        Class[] routeClasses = {controllers.routes.javascript.class};
        for (int i = 0; i < routeClasses.length; i++) {
            for (Field f : routeClasses[i].getFields()) {
                // get its methods
                for (Method m : getAllMethods(f.getType(), withReturnType(play.api.routing.JavaScriptReverseRoute.class))) {
                    // for each method, add its result to the reverseRoutes
                    reverseRoutes.add(m.invoke(f.get(null)));
                }
            }
        }
        // return the reverse routes
        response().setContentType("text/javascript");
        return ok(Routes.javascriptRouter("jsRoutes",
                reverseRoutes.toArray(new play.api.routing.JavaScriptReverseRoute[reverseRoutes.size()])));
    }

    public Result saveDuty() {
        return ok();
    }

}
