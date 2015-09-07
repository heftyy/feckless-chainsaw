package controllers;

import play.*;
import play.libs.Json;
import play.mvc.*;

import views.html.*;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.*;
import java.io.File;
import org.apache.commons.io.FileUtils;
import play.data.DynamicForm;
import play.data.Form;

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
        DynamicForm requestData = Form.form().bindFromRequest();
        String json = requestData.get("json");

        if(json == null) return badRequest("Missing json");

        String timeString = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());

        File dir = new File("files/duty/");

        try {
            FileUtils.forceMkdir(dir);
        } catch (IOException e) {
            return internalServerError("Couldn't create directories.");
        }

        File file = new File("files/duty/duty.json");
        File backupFile = new File("files/duty/duty_"+timeString+".json");

        try {
            if(file.exists()) FileUtils.moveFile(file, backupFile);
        } catch (IOException e) {
            e.printStackTrace();
            return internalServerError("Couldn't make a backup.");
        }

        List<String> lines = new ArrayList<>();
        lines.add(json);
        try {
            FileUtils.writeLines(file, lines);
        } catch (IOException e) {
            return internalServerError("Couldn't save to file.");
        }

        return ok();
    }

    public Result loadDuty() {
        File file = new File("files/duty/duty.json");
        String json;
        try {
            json = FileUtils.readFileToString(file);
        } catch (IOException e) {
            return internalServerError("Couldn't read file.");
        }

        return ok(Json.parse(json));
    }

}
