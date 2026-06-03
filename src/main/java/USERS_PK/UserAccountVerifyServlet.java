
package USERS_PK;

import CUSTOMER_PK.Customer;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.sql.Connection;
import DB_PK.DB;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class UserAccountVerifyServlet extends HttpServlet {

   
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException 
    {
        String verificationCode = request.getParameter("verificationCode");
        
        HttpSession session = request.getSession(false);
        
        String fullName = (String) session.getAttribute("fullName");
        String dob = (String) session.getAttribute("dob");
        String jobTitle = (String) session.getAttribute("jobTitle");
        String email = (String) session.getAttribute("email");
        String otpCode = (String) session.getAttribute("otpCode");
        String phone = (String) session.getAttribute("phone");
        String username = (String) session.getAttribute("username");
        String address = (String) session.getAttribute("address");
        String password = (String) session.getAttribute("password");
        String twilioSid = (String) session.getAttribute("twilioSid");
        String twilioToken = (String) session.getAttribute("twilioToken");
        String twilioSender = (String) session.getAttribute("twilioSender");
        Date birthDate = Date.from(LocalDate.parse(dob).atStartOfDay(ZoneId.systemDefault()).toInstant());
        
        System.out.println("otpCode : " + otpCode);
        System.out.println("verificationCode : " + verificationCode);
        
        if(otpCode.equals(verificationCode))
        {
            Customer customer = new Customer(fullName,birthDate,phone,jobTitle,email,address,twilioSid,twilioToken,twilioSender,username,password,2,true,true);
            int cus_id = 0 ;
            try
            {
                Connection con = DB.getConnection();
                cus_id = Customer.register(customer, con);
                System.out.println("cus_id = " + cus_id);
            }
            catch(Exception ex)
            {
                cus_id = 0;
                ex.printStackTrace();
            }
            
            if(cus_id != 0)
            {
                response.sendRedirect(request.getContextPath() + "/HTML/account-created.html");
            }
            else
            {
                response.sendRedirect(request.getContextPath() + "/HTML/registration-failed.html");
            }
        }
        else
        {
            response.sendRedirect(request.getContextPath() + "/HTML/account-failed.html");
        }
    } 
}
