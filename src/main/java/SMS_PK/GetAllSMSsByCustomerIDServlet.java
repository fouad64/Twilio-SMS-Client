
package SMS_PK;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import DB_PK.DB;
import com.google.gson.Gson;
import jakarta.servlet.http.HttpSession;
import java.sql.Connection;
import java.util.List;

public class GetAllSMSsByCustomerIDServlet extends HttpServlet 
{
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException 
    {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        try
        {
            HttpSession session =  request.getSession(false);
            Integer customer_id =(Integer)session.getAttribute("Customer_id");
            Connection con = DB.getConnection();
            List<SMSMessage> SMSs = SMSMessage.GetAllSMSsByCustomerID(customer_id, con);
            if(SMSs != null)
            {
                Gson Json = new Gson();
                String Data = Json.toJson(SMSs);
                out.print(Data);
            }
        }
        catch (Exception ex) 
        {
            ex.printStackTrace();
        }
    }
}
