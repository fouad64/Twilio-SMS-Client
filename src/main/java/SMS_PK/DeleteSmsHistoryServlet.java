package SMS_PK;

import DB_PK.DB;
import HELPER_PK.Helper;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.Connection;

public class DeleteSmsHistoryServlet extends HttpServlet {

   
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException 
    {
       String sms_deleted_id = request.getParameter("id");
       System.out.println("sms_deleted_id : " + sms_deleted_id);
       Connection con;
        try
        {
            con = DB.getConnection();
            boolean status = Helper.deleteHistorySMSById(Integer.parseInt(sms_deleted_id), con);
            if(status)
            {
                response.sendRedirect(request.getContextPath() + "/HTML/SMSHISTORY.html");
            }
            else
            {
               response.sendRedirect(request.getContextPath() + "/HTML/network-error.html");
            }
        } 
        catch (ClassNotFoundException ex) 
        {
            System.getLogger(DeleteSmsServlet.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
        }
    }

}
