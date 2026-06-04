package CUSTOMER_PK;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import HELPER_PK.Helper;
import DB_PK.DB;
import jakarta.servlet.http.HttpSession;
import java.sql.Connection;
public class CustomerSendSmsServlet extends HttpServlet 
{
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
       String twilioSid = request.getParameter("twilioSid");
       String twilioToken = request.getParameter("twilioToken");
       String twilioSenderID = request.getParameter("fromNumber");
       String toNumber = request.getParameter("toNumber");
       String smsBody = request.getParameter("smsBody");
       
       System.out.println("twilioSid : " + twilioSid);
       System.out.println("twilioToken : " + twilioToken);
       System.out.println("twilioSenderID : " + twilioSenderID);
       System.out.println("toNumber : " + toNumber);
       System.out.println("smsBody : " + smsBody);
       
       boolean status_send_sms = Customer.sendSMS(twilioSid, twilioToken, twilioSenderID, toNumber, smsBody);
       
       if(status_send_sms)
       {
           try
           {
               Connection con = DB.getConnection();
               int sms_id = 0;
               HttpSession session = request.getSession(false);
               Integer cus_id = (Integer) session.getAttribute("Customer_id");
               while(sms_id == 0)
               {
                   sms_id = Helper.saveSMS(cus_id, twilioSenderID, toNumber, smsBody, twilioSenderID, con);
                   if(sms_id > 0) response.sendRedirect(request.getContextPath() + "/HTML/customer-send-sms-success.html");
               }
               System.out.println(" Done ");
           }
           catch (Exception ex) 
           {
               ex.printStackTrace();
           }
       }
       else
       {
           response.sendRedirect(request.getContextPath() + "/HTML/customer-twilio-missing-parameters-send-sms.html");
       }
    }
}
