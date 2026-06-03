package CUSTOMER_PK;

import java.sql.Timestamp;

public class CustomerParameters extends Customer
{
    private int customerTotalSentSms;
    private String customerLastSmsBody;
    private Timestamp customerLastSmsSendAt;
    private String customerToNumber;
    private String customerLastSmsStatus;

    public CustomerParameters(int customerTotalSentSms, String customerLastSmsBody, Timestamp customerLastSmsSendAt, String customerToNumber, String customerLastSmsStatus, int user_id, int customer_id, boolean isActive ,String fullName) {
        super(user_id, customer_id, isActive,fullName);
        this.customerTotalSentSms = customerTotalSentSms;
        this.customerLastSmsBody = customerLastSmsBody;
        this.customerLastSmsSendAt = customerLastSmsSendAt;
        this.customerToNumber = customerToNumber;
        this.customerLastSmsStatus = customerLastSmsStatus;
    }
    
    public CustomerParameters(){}
    
    public int getCustomerTotalSentSms() {
        return customerTotalSentSms;
    }

    public void setCustomerTotalSentSms(int customerTotalSentSms) {
        this.customerTotalSentSms = customerTotalSentSms;
    }

    public String getCustomerLastSmsBody() {
        return customerLastSmsBody;
    }

    public void setCustomerLastSmsBody(String customerLastSmsBody) {
        this.customerLastSmsBody = customerLastSmsBody;
    }

    public Timestamp getCustomerLastSmsSendAt() {
        return customerLastSmsSendAt;
    }

    public void setCustomerLastSmsSendAt(Timestamp customerLastSmsSendAt) {
        this.customerLastSmsSendAt = customerLastSmsSendAt;
    }

    public String getCustomerToNumber() {
        return customerToNumber;
    }

    public void setCustomerToNumber(String customerToNumber) {
        this.customerToNumber = customerToNumber;
    }

    public String getCustomerLastSmsStatus() {
        return customerLastSmsStatus;
    }

    public void setCustomerLastSmsStatus(String customerLastSmsStatus) {
        this.customerLastSmsStatus = customerLastSmsStatus;
    }
    
}
