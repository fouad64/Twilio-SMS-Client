
package CUSTOMER_PK;

import DB_PK.DB;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.sql.Connection;


public class CustomerEditDataServlet extends HttpServlet 
{

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        String fullName = request.getParameter("fullName");
        String dob = request.getParameter("dob");
        String jobTitle = request.getParameter("jobTitle");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String address = request.getParameter("address");

        String password = request.getParameter("password");
        String confirmPw = request.getParameter("confirmPw");

        String twilioSid = request.getParameter("twilioSid");
        String twilioToken = request.getParameter("twilioToken");
        String twilioSender = request.getParameter("twilioSender");
        
        HttpSession session = request.getSession(false);
        Integer user_id = (Integer) session.getAttribute("login_user_id");
        Integer customer_id = (Integer) session.getAttribute("Customer_id");
        
        Customer customer = new Customer();
        
        customer.setUserId(user_id);
        customer.setCustomer_id(customer_id);
        customer.setFullName(fullName);
        customer.setPasswordHash(password);
        customer.setDob(java.sql.Date.valueOf(dob));
        customer.setJobTitle(jobTitle);
        customer.setEmail(email);
        customer.setPhoneNumber(phone);
        customer.setTwilioAccountSID(twilioSid);
        customer.setTwilioAuthToken(twilioToken);
        customer.setTwilioSenderId(twilioSender);
        customer.setAddress(address);
        
        boolean hasPassword = password != null && confirmPw != null && !password.trim().isEmpty() && !confirmPw.trim().isEmpty();
        try 
        {
            Connection con = DB.getConnection();
            
            if(!hasPassword)
            {
                boolean status = Customer.updateProfile_without_password(customer, con);
                if(status)
                {
                    response.sendRedirect(request.getContextPath() + "/HTML/account-updated.html");
                }
                else
                {
                    response.sendRedirect(request.getContextPath() + "/HTML/account-updated-failed.html");
                }
            }
            else
            {
                boolean status = Customer.updateProfile_with_password(customer, con);
                if(status)
                {
                    response.sendRedirect(request.getContextPath() + "/HTML/account-updated.html");
                }
                else
                {
                    response.sendRedirect(request.getContextPath() + "/HTML/account-updated-failed.html");
                }
            }
        } 
        catch (ClassNotFoundException ex) 
        {
            System.getLogger(CustomerEditDataServlet.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
            response.sendRedirect(request.getContextPath() + "HTML/account-updated-failed.html");
        } 
    }

}
