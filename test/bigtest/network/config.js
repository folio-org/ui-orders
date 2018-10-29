// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
export default function config() {

  this.get('/source', {
    "sources" : [ ],
    "total_records" : 0,
    "first" : 0,
    "last" : 0
  });

  this.get('/po_line', {
    "po_lines" : [ ],
    "total_records" : 0,
    "first" : 0,
    "last" : 0
  });

  this.get('/orders', {
    "composite_purchase_orders" : [ {
      "id" : "1ab7ef6a-d1d4-4a4f-90a2-882aed18af14",
      "notes" : [ ],
      "po_number" : "268758",
      "po_lines" : [ ]
    }, {
      "id" : "e5ae4afd-3fa9-494e-a972-f541df9b877e",
      "notes" : [ ],
      "po_number" : "268879",
      "po_lines" : [ ]
    }, {
      "id" : "00ed10af-fac2-46ad-9f94-a298358646a2",
      "notes" : [ ],
      "po_number" : "S58227",
      "po_lines" : [ ]
    }, {
      "id" : "07f65192-44a4-483d-97aa-b137bbd96390",
      "notes" : [ ],
      "po_number" : "S60402",
      "po_lines" : [ ]
    }, {
      "id" : "e20af8c8-b07d-47a1-9ebd-f1187e9335bd",
      "notes" : [ ],
      "po_number" : "306251",
      "po_lines" : [ ]
    }, {
      "id" : "e41e0161-2bc6-41f3-a6e7-34fc13250bf1",
      "notes" : [ ],
      "po_number" : "306857",
      "po_lines" : [ ]
    }, {
      "id" : "8c328a18-5761-4329-95f6-599412c32310",
      "notes" : [ ],
      "po_number" : "14383007",
      "po_lines" : [ ]
    }, {
      "id" : "05bdf3c8-01f0-4ddb-bd6c-6efd465f9e33",
      "notes" : [ ],
      "po_number" : "313000",
      "po_lines" : [ ]
    }, {
      "id" : "f4dc647c-ec82-442e-b13d-f9505b7ce8e9",
      "notes" : [ ],
      "po_number" : "312325",
      "po_lines" : [ ]
    }, {
      "id" : "0610be6d-0ddd-494b-b867-19f63d8b5d6d",
      "notes" : [ ],
      "po_number" : "52590",
      "po_lines" : [ ]
    }, {
      "id" : "589a6016-3463-49f6-8aa2-dc315d0665fd",
      "notes" : [ ],
      "po_number" : "101101",
      "po_lines" : [ ]
    }, {
      "id" : "55b97a4a-6601-4488-84e1-8b0d47a3f523",
      "notes" : [ ],
      "po_number" : "101113",
      "po_lines" : [ ]
    }, {
      "id" : "9447d062-89ec-486e-a14b-572f3efb9f8c",
      "notes" : [ ],
      "po_number" : "101125",
      "po_lines" : [ ]
    }, {
      "id" : "1d6a455f-29c5-4e51-84d9-e28450ef86ad",
      "notes" : [ ],
      "po_number" : "36547",
      "po_lines" : [ ]
    }, {
      "id" : "c27e60f9-6361-44c1-976e-0c4821a33a7d",
      "notes" : [ ],
      "po_number" : "38434",
      "po_lines" : [ ]
    } ],
    "total_records" : 15
  });

  this.get('/vendor', {
    "vendors" : [ {
      "id" : "05faecc1-c6ab-4eb5-b9f4-97015074a492",
      "name" : "GOBI Library Solutions",
      "code" : "GOBI",
      "description" : "Use for print and eBooks, approval plans, firm orders, standing orders, DDA",
      "vendor_status" : "Active",
      "language" : "en-us",
      "aliases" : [ {
        "value" : "YBP Library Services",
        "description" : "former name"
      } ],
      "addresses" : [ {
        "address" : {
          "addressLine1" : "999 Maple Street",
          "addressLine2" : "2",
          "city" : "Contoocook",
          "stateRegion" : "NH",
          "zipCode" : "03229",
          "country" : "USA"
        },
        "categories" : [ "Customer", "Service", "Shipments" ],
        "language" : "en",
        "san_code" : "1234567"
      } ],
      "phone_numbers" : [ {
        "phone_number" : {
          "country_code" : "1",
          "area_code" : "800",
          "phone_number" : "258-3774"
        },
        "categories" : [ "Customer Service" ],
        "language" : "en-us"
      } ],
      "emails" : [ {
        "email" : {
          "value" : "gobiserviceissue@ebsco.com",
          "description" : "for general questions"
        },
        "categories" : [ "Customer Service" ],
        "language" : "en-us"
      } ],
      "urls" : [ {
        "url" : {
          "value" : "https://gobi.ebsco.com/",
          "description" : "main website"
        },
        "language" : "en-us",
        "categories" : [ ],
        "notes" : ""
      } ],
      "contacts" : [ {
        "contact_person" : {
          "prefix" : "",
          "first_name" : "Sarah",
          "last_name" : "Silverman",
          "language" : "en-us",
          "notes" : "",
          "phone_number" : {
            "country_code" : "1",
            "area_code" : "800",
            "phone_number" : "258-3774 x8852"
          },
          "email" : {
            "value" : "ssilverman@ebsco.com",
            "description" : "main customer service contact"
          },
          "address" : {
            "addressLine1" : "999 Maple Street",
            "addressLine2" : "",
            "city" : "Contoocook",
            "stateRegion" : "NH",
            "zipCode" : "01938",
            "country" : "USA"
          },
          "url" : {
            "value" : "https://www.doi.gov/",
            "description" : "web address for U.S. Dept. of Interior"
          }
        },
        "language" : "en-us",
        "categories" : [ ]
      } ],
      "agreements" : [ {
        "name" : "No formal agreement",
        "discount" : 10.0,
        "reference_url" : "",
        "notes" : "Review SLAs & fulfillment stats 2 months before end of FY"
      } ],
      "erp_code" : "G64758-74836",
      "payment_method" : "EFT",
      "access_provider" : false,
      "governmental" : false,
      "licensor" : false,
      "material_supplier" : true,
      "vendor_currencies" : [ "USD" ],
      "claiming_interval" : 45,
      "discount_percent" : 10.0,
      "expected_activation_interval" : 3,
      "expected_invoice_interval" : 30,
      "renewal_activation_interval" : 0,
      "subscription_interval" : 0,
      "tax_id" : "888888888",
      "liable_for_vat" : false,
      "tax_percentage" : 0.0,
      "edi" : {
        "vendor_edi_code" : "1694510",
        "vendor_edi_type" : "31B",
        "lib_edi_code" : "7659876",
        "lib_edi_type" : "31B",
        "prorate_tax" : true,
        "prorate_fees" : false,
        "edi_naming_convention" : "*.edi",
        "send_acct_num" : true,
        "support_order" : true,
        "support_invoice" : true,
        "notes" : "no EDI invoices for our tech services invoices",
        "edi_ftp" : {
          "ftp_format" : "SFTP",
          "server_address" : "ftp.ybp.com",
          "username" : "sample",
          "password" : "password",
          "ftp_mode" : "binary",
          "ftp_conn_mode" : "Passive",
          "ftp_port" : "22",
          "order_directory" : "/dropoff",
          "invoice_directory" : "/invoices",
          "notes" : "separate directories for EOCRs and cat records"
        },
        "edi_job" : {
          "schedule_edi" : true,
          "is_monday" : false,
          "is_tuesday" : false,
          "is_wednesday" : false,
          "is_thursday" : false,
          "is_friday" : false,
          "is_saturday" : false,
          "is_sunday" : false,
          "send_to_emails" : "bobbarker@priceisright.com",
          "notify_all_edi" : true,
          "notify_invoice_only" : false,
          "notify_error_only" : false
        }
      },
      "interfaces" : [ {
        "name" : "GOBI",
        "uri" : "www.gobi3.com",
        "username" : "",
        "password" : "",
        "notes" : "all staff have different logons with different permissions",
        "available" : false,
        "delivery_method" : "",
        "statistics_format" : "",
        "locally_stored" : "false",
        "online_location" : "",
        "statistics_notes" : "get stats on demand from GOBI, or contact customers service"
      } ],
      "accounts" : [ {
        "name" : "US print orders",
        "account_no" : "99999-10",
        "description" : "Main library orders for print books, shipped from US office",
        "app_system_no" : "",
        "payment_method" : "EFT",
        "account_status" : "Active",
        "contact_info" : "jlegier@ebsco.com",
        "library_code" : "COB",
        "library_edi_code" : "765987610",
        "notes" : "separate accounts for eBooks and UK orders"
      } ],
      "changelogs" : [ {
        "description" : "This is a sample note.",
        "timestamp" : "2008-05-15T10:53:00.000+0000"
      } ]
    }, {
      "id" : "976db970-0318-48cb-87a1-0f09441ec28a",
      "name" : "Amazon.com",
      "code" : "AMAZ",
      "description" : "Use for rush orders, replacement requests, and second hand market",
      "vendor_status" : "Active",
      "language" : "en-us",
      "aliases" : [ {
        "value" : "Amazon",
        "description" : ""
      } ],
      "addresses" : [ {
        "address" : {
          "addressLine1" : "1 Centerpiece Blvd.",
          "addressLine2" : "P.O. Box 15550",
          "city" : "New Castle",
          "stateRegion" : "DE",
          "zipCode" : "19720-5550",
          "country" : "USA"
        },
        "categories" : [ ],
        "language" : "English",
        "san_code" : ""
      } ],
      "phone_numbers" : [ {
        "phone_number" : {
          "country_code" : "1",
          "area_code" : "888",
          "phone_number" : "238-22090"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "emails" : [ {
        "email" : {
          "value" : "cust.service03@amazon.com",
          "description" : "customer service"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "urls" : [ {
        "url" : {
          "value" : "https://www.amazon.com",
          "description" : "main website"
        },
        "language" : "en-us",
        "categories" : [ ],
        "notes" : ""
      } ],
      "contacts" : [ {
        "contact_person" : {
          "prefix" : "Ms.",
          "first_name" : "Carrie",
          "last_name" : "Brownstein",
          "language" : "English",
          "notes" : "",
          "phone_number" : {
            "country_code" : "1",
            "area_code" : "888",
            "phone_number" : "238-2209"
          },
          "email" : {
            "value" : "cust.service03@amazon.com",
            "description" : "main customer service contact"
          },
          "address" : {
            "addressLine1" : "325 9th Ave.",
            "addressLine2" : "",
            "city" : "Seattle",
            "stateRegion" : "WA",
            "zipCode" : "",
            "country" : "USA"
          },
          "url" : {
            "value" : "https://www.doi.gov/",
            "description" : "web address for U.S. Dept. of Interior"
          }
        },
        "language" : "English",
        "categories" : [ ]
      } ],
      "agreements" : [ {
        "name" : "",
        "discount" : 0.0,
        "reference_url" : "",
        "notes" : ""
      } ],
      "erp_code" : "G64758-74834",
      "payment_method" : "credit card",
      "access_provider" : false,
      "governmental" : false,
      "licensor" : false,
      "material_supplier" : true,
      "vendor_currencies" : [ "USD" ],
      "claiming_interval" : 45,
      "discount_percent" : 0.0,
      "expected_activation_interval" : 0,
      "expected_invoice_interval" : 0,
      "renewal_activation_interval" : 0,
      "subscription_interval" : 0,
      "tax_id" : "",
      "liable_for_vat" : false,
      "tax_percentage" : 0.0,
      "edi" : {
        "vendor_edi_code" : "",
        "vendor_edi_type" : "",
        "lib_edi_code" : "",
        "lib_edi_type" : "",
        "prorate_tax" : false,
        "prorate_fees" : false,
        "edi_naming_convention" : "",
        "send_acct_num" : false,
        "support_order" : false,
        "support_invoice" : false,
        "notes" : "",
        "edi_ftp" : {
          "ftp_format" : "",
          "server_address" : "",
          "username" : "",
          "password" : "",
          "ftp_mode" : "",
          "ftp_conn_mode" : "",
          "ftp_port" : "22",
          "order_directory" : "",
          "invoice_directory" : "",
          "notes" : ""
        },
        "edi_job" : {
          "schedule_edi" : false,
          "is_monday" : false,
          "is_tuesday" : false,
          "is_wednesday" : false,
          "is_thursday" : false,
          "is_friday" : false,
          "is_saturday" : false,
          "is_sunday" : false,
          "send_to_emails" : "",
          "notify_all_edi" : false,
          "notify_invoice_only" : false,
          "notify_error_only" : false
        }
      },
      "interfaces" : [ {
        "name" : "Amazon",
        "uri" : "www.amazon.com",
        "username" : "****",
        "password" : "****",
        "notes" : "",
        "available" : false,
        "delivery_method" : "",
        "statistics_format" : "",
        "locally_stored" : "false",
        "online_location" : "",
        "statistics_notes" : ""
      } ],
      "accounts" : [ {
        "name" : "Monographic ordering unit account",
        "account_no" : "1234",
        "description" : "Monographic ordering unit account",
        "app_system_no" : "",
        "payment_method" : "credit card",
        "account_status" : "Active",
        "contact_info" : "cust.service03@amazon.com",
        "library_code" : "COB",
        "library_edi_code" : "765987610",
        "notes" : ""
      } ],
      "changelogs" : [ {
        "description" : "This is a sample note.",
        "timestamp" : "2008-05-15T10:53:00.000+0000"
      } ]
    }, {
      "id" : "63521ebe-4632-4de0-a810-c7a96fa8948e",
      "name" : "Naxos of America, Inc.",
      "code" : "NAXO",
      "description" : "AV streaming services, other onilne content",
      "vendor_status" : "Active",
      "language" : "en-us",
      "aliases" : [ {
        "value" : "Naxos",
        "description" : ""
      } ],
      "addresses" : [ {
        "address" : {
          "addressLine1" : "416 Mary Lindsay Polk Dr.",
          "addressLine2" : "",
          "city" : "Franklin",
          "stateRegion" : "TN",
          "zipCode" : "37067",
          "country" : "USA"
        },
        "categories" : [ ],
        "language" : "English",
        "san_code" : ""
      } ],
      "phone_numbers" : [ {
        "phone_number" : {
          "country_code" : "1",
          "area_code" : "615",
          "phone_number" : "771-9393"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "emails" : [ {
        "email" : {
          "value" : "service@naxosusa.com",
          "description" : "Customer Service"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "urls" : [ {
        "url" : {
          "value" : "https://www.naxos.com/",
          "description" : "main website"
        },
        "language" : "en-us",
        "categories" : [ ],
        "notes" : ""
      } ],
      "contacts" : [ {
        "contact_person" : {
          "prefix" : "Prof.",
          "first_name" : "Marie",
          "last_name" : "Curie",
          "language" : "English",
          "notes" : "",
          "phone_number" : {
            "country_code" : "1",
            "area_code" : "615",
            "phone_number" : "771-9393 x2819"
          },
          "email" : {
            "value" : "Mcur@naxosusa.com",
            "description" : "Databases"
          },
          "address" : {
            "addressLine1" : "416 Mary Lindsay Polk Dr.",
            "addressLine2" : "",
            "city" : "Franklin",
            "stateRegion" : "TN",
            "zipCode" : "",
            "country" : "USA"
          },
          "url" : {
            "value" : "https://www.doi.gov/",
            "description" : "web address for U.S. Dept. of Interior"
          }
        },
        "language" : "English",
        "categories" : [ ]
      } ],
      "agreements" : [ {
        "name" : "Naxos Music Library, Naxos Video Library",
        "discount" : 0.0,
        "reference_url" : "F:\\Serials\\Licensing\\License and Renewal Agreements\\Content Providers\\NAXOS",
        "notes" : ""
      } ],
      "erp_code" : "G64758-74827",
      "payment_method" : "EFT",
      "access_provider" : true,
      "governmental" : false,
      "licensor" : true,
      "material_supplier" : true,
      "vendor_currencies" : [ "USD" ],
      "claiming_interval" : 0,
      "discount_percent" : 0.0,
      "expected_activation_interval" : 30,
      "expected_invoice_interval" : 30,
      "renewal_activation_interval" : 365,
      "subscription_interval" : 365,
      "tax_id" : "",
      "liable_for_vat" : false,
      "tax_percentage" : 0.0,
      "edi" : {
        "vendor_edi_code" : "",
        "vendor_edi_type" : "",
        "lib_edi_code" : "",
        "lib_edi_type" : "",
        "prorate_tax" : false,
        "prorate_fees" : false,
        "edi_naming_convention" : "",
        "send_acct_num" : false,
        "support_order" : false,
        "support_invoice" : false,
        "notes" : "",
        "edi_ftp" : {
          "ftp_format" : "",
          "server_address" : "",
          "username" : "",
          "password" : "",
          "ftp_mode" : "",
          "ftp_conn_mode" : "",
          "ftp_port" : "22",
          "order_directory" : "",
          "invoice_directory" : "",
          "notes" : ""
        },
        "edi_job" : {
          "schedule_edi" : false,
          "is_monday" : false,
          "is_tuesday" : false,
          "is_wednesday" : false,
          "is_thursday" : false,
          "is_friday" : false,
          "is_saturday" : false,
          "is_sunday" : false,
          "send_to_emails" : "",
          "notify_all_edi" : false,
          "notify_invoice_only" : false,
          "notify_error_only" : false
        }
      },
      "interfaces" : [ {
        "name" : "Naxos Digital Services, U.S.",
        "uri" : "https://www.naxosmusiclibrary.com",
        "username" : "",
        "password" : "",
        "notes" : "See also http://sample.naxosvideolibrary.com/ for Naxos Video Library",
        "available" : true,
        "delivery_method" : "online",
        "statistics_format" : "Non-COUNTER",
        "locally_stored" : "https://www.lib.sample.edu/staff/collectiondevelopment/",
        "online_location" : "http://www.naxosmusiclibrary.com/",
        "statistics_notes" : "Login on interface used to access content."
      } ],
      "accounts" : [ {
        "name" : "Serials",
        "account_no" : "xxxx4367",
        "description" : "Libraries",
        "app_system_no" : "",
        "payment_method" : "EFT",
        "account_status" : "Active",
        "contact_info" : "service@naxosusa.com",
        "library_code" : "COB",
        "library_edi_code" : "765987610",
        "notes" : ""
      } ],
      "changelogs" : [ {
        "description" : "This is a sample note.",
        "timestamp" : "2008-05-15T10:53:00.000+0000"
      } ]
    }, {
      "id" : "f650d14d-9bf9-4ea7-b87f-761347ba9459",
      "name" : "Alexander Street Press",
      "code" : "ALEXS",
      "description" : "AV streaming services",
      "vendor_status" : "Active",
      "language" : "en-us",
      "aliases" : [ {
        "value" : "Alexander Street",
        "description" : ""
      } ],
      "addresses" : [ {
        "address" : {
          "addressLine1" : "3212 Duke Street",
          "addressLine2" : "",
          "city" : "Alexandria",
          "stateRegion" : "VA",
          "zipCode" : "22314",
          "country" : "USA"
        },
        "categories" : [ ],
        "language" : "English",
        "san_code" : ""
      } ],
      "phone_numbers" : [ {
        "phone_number" : {
          "country_code" : "1",
          "area_code" : "800",
          "phone_number" : "889-5937"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "emails" : [ {
        "email" : {
          "value" : "customerservice@alexanderstreet.com",
          "description" : "main customer service email"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "urls" : [ {
        "url" : {
          "value" : "https://alexanderstreet.com/",
          "description" : "main website"
        },
        "language" : "en-us",
        "categories" : [ ],
        "notes" : ""
      } ],
      "contacts" : [ {
        "contact_person" : {
          "prefix" : "Mr.",
          "first_name" : "David",
          "last_name" : "Grohl",
          "language" : "English",
          "notes" : "",
          "phone_number" : {
            "country_code" : "1",
            "area_code" : "800",
            "phone_number" : "889-5937"
          },
          "email" : {
            "value" : "customerservice@alexanderstreet.com",
            "description" : ""
          },
          "address" : {
            "addressLine1" : "3212 Duke Street",
            "addressLine2" : "",
            "city" : "Alexandria ",
            "stateRegion" : "VA",
            "zipCode" : "",
            "country" : "USA"
          },
          "url" : {
            "value" : "https://www.doi.gov/",
            "description" : "web address for U.S. Dept. of Interior"
          }
        },
        "language" : "English",
        "categories" : [ ]
      } ],
      "agreements" : [ {
        "name" : "library access",
        "discount" : 0.0,
        "reference_url" : "",
        "notes" : ""
      } ],
      "erp_code" : "G64758-74828",
      "payment_method" : "check",
      "access_provider" : true,
      "governmental" : false,
      "licensor" : true,
      "material_supplier" : true,
      "vendor_currencies" : [ "USD" ],
      "claiming_interval" : 0,
      "discount_percent" : 0.0,
      "expected_activation_interval" : 1,
      "expected_invoice_interval" : 30,
      "renewal_activation_interval" : 365,
      "subscription_interval" : 365,
      "tax_id" : "",
      "liable_for_vat" : false,
      "tax_percentage" : 0.0,
      "edi" : {
        "vendor_edi_code" : "",
        "vendor_edi_type" : "",
        "lib_edi_code" : "",
        "lib_edi_type" : "",
        "prorate_tax" : false,
        "prorate_fees" : false,
        "edi_naming_convention" : "",
        "send_acct_num" : false,
        "support_order" : false,
        "support_invoice" : false,
        "notes" : "",
        "edi_ftp" : {
          "ftp_format" : "",
          "server_address" : "",
          "username" : "",
          "password" : "",
          "ftp_mode" : "",
          "ftp_conn_mode" : "",
          "ftp_port" : "22",
          "order_directory" : "",
          "invoice_directory" : "",
          "notes" : ""
        },
        "edi_job" : {
          "schedule_edi" : false,
          "is_monday" : false,
          "is_tuesday" : false,
          "is_wednesday" : false,
          "is_thursday" : false,
          "is_friday" : false,
          "is_saturday" : false,
          "is_sunday" : false,
          "send_to_emails" : "",
          "notify_all_edi" : false,
          "notify_invoice_only" : false,
          "notify_error_only" : false
        }
      },
      "interfaces" : [ {
        "name" : "Academic Video Online",
        "uri" : "https://search.alexanderstreet.com/avon",
        "username" : "****",
        "password" : "****",
        "notes" : "",
        "available" : false,
        "delivery_method" : "",
        "statistics_format" : "",
        "locally_stored" : "",
        "online_location" : "",
        "statistics_notes" : ""
      } ],
      "accounts" : [ {
        "name" : "Library account",
        "account_no" : "1234",
        "description" : "Main library account",
        "app_system_no" : "",
        "payment_method" : "check",
        "account_status" : "Active",
        "contact_info" : "customerservice@alexanderstreet.com",
        "library_code" : "COB",
        "library_edi_code" : "765987610",
        "notes" : ""
      } ],
      "changelogs" : [ {
        "description" : "This is a sample note.",
        "timestamp" : "2008-05-15T10:53:00.000+0000"
      } ]
    }, {
      "id" : "be8629f2-f1d4-49a3-a81e-f568b700146a",
      "name" : "Jean Simmons",
      "code" : "SJEAN",
      "description" : "Individual donor to library archives",
      "vendor_status" : "Active",
      "language" : "en-us",
      "aliases" : [ {
        "value" : "Sister Jean",
        "description" : ""
      } ],
      "addresses" : [ {
        "address" : {
          "addressLine1" : "1032 W. Sheridan Rd",
          "addressLine2" : "",
          "city" : "Chicago",
          "stateRegion" : "IL",
          "zipCode" : "60660",
          "country" : "USA"
        },
        "categories" : [ ],
        "language" : "English",
        "san_code" : ""
      } ],
      "phone_numbers" : [ {
        "phone_number" : {
          "country_code" : "1",
          "area_code" : "773",
          "phone_number" : "274-3000"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "emails" : [ {
        "email" : {
          "value" : "sister@luc.edu",
          "description" : "personal email "
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "urls" : [ {
        "url" : {
          "value" : "",
          "description" : ""
        },
        "language" : "",
        "categories" : [ ],
        "notes" : ""
      } ],
      "contacts" : [ {
        "contact_person" : {
          "prefix" : "Sister",
          "first_name" : "Jean",
          "last_name" : "Simmons",
          "language" : "English",
          "notes" : "",
          "phone_number" : {
            "country_code" : "1",
            "area_code" : "773",
            "phone_number" : "274-3000"
          },
          "email" : {
            "value" : "sister@luc.edu",
            "description" : ""
          },
          "address" : {
            "addressLine1" : "1032 W. Sheridan Rd",
            "addressLine2" : "",
            "city" : "Chicago",
            "stateRegion" : "IL",
            "zipCode" : "",
            "country" : "USA"
          },
          "url" : {
            "value" : "https://www.doi.gov/",
            "description" : "web address for U.S. Dept. of Interior"
          }
        },
        "language" : "English",
        "categories" : [ ]
      } ],
      "agreements" : [ ],
      "erp_code" : "G64758-74830",
      "payment_method" : "check",
      "access_provider" : false,
      "governmental" : false,
      "licensor" : false,
      "material_supplier" : true,
      "vendor_currencies" : [ "USD" ],
      "claiming_interval" : 0,
      "discount_percent" : 0.0,
      "expected_activation_interval" : 0,
      "expected_invoice_interval" : 0,
      "renewal_activation_interval" : 0,
      "subscription_interval" : 0,
      "tax_id" : "",
      "liable_for_vat" : false,
      "tax_percentage" : 0.0,
      "edi" : {
        "vendor_edi_code" : "",
        "vendor_edi_type" : "",
        "lib_edi_code" : "",
        "lib_edi_type" : "",
        "prorate_tax" : false,
        "prorate_fees" : false,
        "edi_naming_convention" : "",
        "send_acct_num" : false,
        "support_order" : false,
        "support_invoice" : false,
        "notes" : "",
        "edi_ftp" : {
          "ftp_format" : "",
          "server_address" : "",
          "username" : "",
          "password" : "",
          "ftp_mode" : "",
          "ftp_conn_mode" : "",
          "ftp_port" : "22",
          "order_directory" : "",
          "invoice_directory" : "",
          "notes" : ""
        },
        "edi_job" : {
          "schedule_edi" : false,
          "is_monday" : false,
          "is_tuesday" : false,
          "is_wednesday" : false,
          "is_thursday" : false,
          "is_friday" : false,
          "is_saturday" : false,
          "is_sunday" : false,
          "send_to_emails" : "",
          "notify_all_edi" : false,
          "notify_invoice_only" : false,
          "notify_error_only" : false
        }
      },
      "interfaces" : [ {
        "name" : "",
        "uri" : "",
        "username" : "",
        "password" : "",
        "notes" : "",
        "available" : false,
        "delivery_method" : "",
        "statistics_format" : "",
        "locally_stored" : "",
        "online_location" : "",
        "statistics_notes" : ""
      } ],
      "accounts" : [ {
        "name" : "SJean account",
        "account_no" : "1234",
        "description" : "Donor account",
        "app_system_no" : "",
        "payment_method" : "check",
        "account_status" : "Active",
        "contact_info" : "sister@luc.edu",
        "library_code" : "COB",
        "library_edi_code" : "765987610",
        "notes" : ""
      } ],
      "changelogs" : [ {
        "description" : "This is a sample note.",
        "timestamp" : "2008-05-15T10:53:00.000+0000"
      } ]
    }, {
      "id" : "7d6c870c-e94f-4def-b084-c80c383e4141",
      "name" : "United States Geological Survey",
      "code" : "USGS",
      "description" : "Maps and materials from the USGS",
      "vendor_status" : "Active",
      "language" : "en-us",
      "aliases" : [ {
        "value" : "USGS",
        "description" : ""
      } ],
      "addresses" : [ {
        "address" : {
          "addressLine1" : "12201 Sunrise Valley Drive",
          "addressLine2" : "P.O. Box 15550",
          "city" : "Reston",
          "stateRegion" : "VA",
          "zipCode" : "20192",
          "country" : "USA"
        },
        "categories" : [ ],
        "language" : "English",
        "san_code" : ""
      } ],
      "phone_numbers" : [ {
        "phone_number" : {
          "country_code" : "1",
          "area_code" : "888",
          "phone_number" : "ASK-USGS"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "emails" : [ {
        "email" : {
          "value" : "usgsstore@usgs.gov",
          "description" : "main customer service email"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "urls" : [ {
        "url" : {
          "value" : "https://www.usgs.gov/",
          "description" : "main website"
        },
        "language" : "en-us",
        "categories" : [ ],
        "notes" : ""
      } ],
      "contacts" : [ {
        "contact_person" : {
          "prefix" : "Mr.",
          "first_name" : "Ryan",
          "last_name" : "Zinke",
          "language" : "English",
          "notes" : "",
          "phone_number" : {
            "country_code" : "1",
            "area_code" : "202",
            "phone_number" : "208-3100"
          },
          "email" : {
            "value" : "feedback@ios.doi.gov",
            "description" : "contact email for U.S. Dept of the Interior"
          },
          "address" : {
            "addressLine1" : "1849 C Street, N.W.",
            "addressLine2" : "",
            "city" : "Washington",
            "stateRegion" : "D.C.",
            "zipCode" : "",
            "country" : "USA"
          },
          "url" : {
            "value" : "https://www.doi.gov/",
            "description" : "web address for U.S. Dept. of Interior"
          }
        },
        "language" : "English",
        "categories" : [ ]
      } ],
      "agreements" : [ {
        "name" : "",
        "discount" : 0.0,
        "reference_url" : "",
        "notes" : ""
      } ],
      "erp_code" : "G64758-74833",
      "payment_method" : "credit card",
      "access_provider" : false,
      "governmental" : true,
      "licensor" : false,
      "material_supplier" : true,
      "vendor_currencies" : [ "USD" ],
      "claiming_interval" : 45,
      "discount_percent" : 0.0,
      "expected_activation_interval" : 0,
      "expected_invoice_interval" : 0,
      "renewal_activation_interval" : 0,
      "subscription_interval" : 0,
      "tax_id" : "",
      "liable_for_vat" : false,
      "tax_percentage" : 0.0,
      "edi" : {
        "vendor_edi_code" : "",
        "vendor_edi_type" : "",
        "lib_edi_code" : "",
        "lib_edi_type" : "",
        "prorate_tax" : false,
        "prorate_fees" : false,
        "edi_naming_convention" : "",
        "send_acct_num" : false,
        "support_order" : false,
        "support_invoice" : false,
        "notes" : "",
        "edi_ftp" : {
          "ftp_format" : "",
          "server_address" : "",
          "username" : "",
          "password" : "",
          "ftp_mode" : "",
          "ftp_conn_mode" : "",
          "ftp_port" : "22",
          "order_directory" : "",
          "invoice_directory" : "",
          "notes" : ""
        },
        "edi_job" : {
          "schedule_edi" : false,
          "is_monday" : false,
          "is_tuesday" : false,
          "is_wednesday" : false,
          "is_thursday" : false,
          "is_friday" : false,
          "is_saturday" : false,
          "is_sunday" : false,
          "send_to_emails" : "",
          "notify_all_edi" : false,
          "notify_invoice_only" : false,
          "notify_error_only" : false
        }
      },
      "interfaces" : [ {
        "name" : "USGS Store",
        "uri" : "https://store.usgs.gov/",
        "username" : "****",
        "password" : "****",
        "notes" : "",
        "available" : false,
        "delivery_method" : "",
        "statistics_format" : "",
        "locally_stored" : "false",
        "online_location" : "",
        "statistics_notes" : ""
      } ],
      "accounts" : [ {
        "name" : "Cartographic account",
        "account_no" : "1234",
        "description" : "Monographic ordering unit accountt",
        "app_system_no" : "",
        "payment_method" : "credit card",
        "account_status" : "Active",
        "contact_info" : "usgsstore@usgs.gov",
        "library_code" : "COB",
        "library_edi_code" : "765987610",
        "notes" : ""
      } ],
      "changelogs" : [ {
        "description" : "This is a sample note.",
        "timestamp" : "2008-05-15T10:53:00.000+0000"
      } ]
    }, {
      "id" : "8154ed76-e806-4d41-8ed6-e9f51842911d",
      "name" : "Otto Harrassowitz GmbH & Co. KG",
      "code" : "HARRA",
      "description" : "Use for monographs, approval plans, firms orders, and standing orders",
      "vendor_status" : "Active",
      "language" : "en-us",
      "aliases" : [ {
        "value" : "Harrassowitz",
        "description" : "shorter name"
      } ],
      "addresses" : [ {
        "address" : {
          "addressLine1" : "Kreuzberger Ring 6 b-d",
          "addressLine2" : "",
          "city" : "Wiesbaden",
          "stateRegion" : "",
          "zipCode" : "65205",
          "country" : "Germany"
        },
        "categories" : [ "Customer Service", "Payments", "Returns", "Shipments" ],
        "language" : "German",
        "san_code" : "1234567"
      } ],
      "phone_numbers" : [ {
        "phone_number" : {
          "country_code" : "49",
          "area_code" : "611",
          "phone_number" : "530 ext. 0"
        },
        "categories" : [ "Customer Service", "Payments", "Returns", "Shipments" ],
        "language" : "German"
      } ],
      "emails" : [ {
        "email" : {
          "value" : "service@harrassowitz.de",
          "description" : "customer service"
        },
        "categories" : [ ],
        "language" : "German and English"
      } ],
      "urls" : [ {
        "url" : {
          "value" : "https://www.harrassowitz.de/",
          "description" : "main website"
        },
        "language" : "en-us",
        "categories" : [ ],
        "notes" : ""
      } ],
      "contacts" : [ {
        "contact_person" : {
          "prefix" : "Frau",
          "first_name" : "Gabriele",
          "last_name" : "Kerner",
          "language" : "German and English",
          "notes" : "",
          "phone_number" : {
            "country_code" : "49",
            "area_code" : "611",
            "phone_number" : "530 ext. 0"
          },
          "email" : {
            "value" : "service@harrassowitz.de",
            "description" : "main customer service contact"
          },
          "address" : {
            "addressLine1" : "Kreuzberger Ring 6 b-d",
            "addressLine2" : "",
            "city" : "Wiesbaden",
            "stateRegion" : "",
            "zipCode" : "",
            "country" : "Germany"
          },
          "url" : {
            "value" : "https://www.doi.gov/",
            "description" : "web address for U.S. Dept. of Interior"
          }
        },
        "language" : "German and English",
        "categories" : [ ]
      } ],
      "agreements" : [ {
        "name" : "No formal agreement",
        "discount" : 0.0,
        "reference_url" : "",
        "notes" : ""
      } ],
      "erp_code" : "G64758-74835",
      "payment_method" : "check",
      "access_provider" : false,
      "governmental" : false,
      "licensor" : false,
      "material_supplier" : true,
      "vendor_currencies" : [ "USD" ],
      "claiming_interval" : 75,
      "discount_percent" : 0.0,
      "expected_activation_interval" : 0,
      "expected_invoice_interval" : 30,
      "renewal_activation_interval" : 0,
      "subscription_interval" : 0,
      "tax_id" : "",
      "liable_for_vat" : false,
      "tax_percentage" : 0.0,
      "edi" : {
        "vendor_edi_code" : "v10063",
        "vendor_edi_type" : "",
        "lib_edi_code" : "COB",
        "lib_edi_type" : "",
        "prorate_tax" : false,
        "prorate_fees" : false,
        "edi_naming_convention" : "****.edu",
        "send_acct_num" : true,
        "support_order" : true,
        "support_invoice" : true,
        "notes" : "",
        "edi_ftp" : {
          "ftp_format" : "SFTP",
          "server_address" : "ftp.harrassowitz.de",
          "username" : "sample",
          "password" : "password",
          "ftp_mode" : "binary",
          "ftp_conn_mode" : "Passive",
          "ftp_port" : "22",
          "order_directory" : "/orders",
          "invoice_directory" : "/invoices",
          "notes" : ""
        },
        "edi_job" : {
          "schedule_edi" : true,
          "is_monday" : false,
          "is_tuesday" : false,
          "is_wednesday" : false,
          "is_thursday" : false,
          "is_friday" : false,
          "is_saturday" : false,
          "is_sunday" : false,
          "send_to_emails" : "",
          "notify_all_edi" : true,
          "notify_invoice_only" : false,
          "notify_error_only" : false
        }
      },
      "interfaces" : [ {
        "name" : "OttoEditions",
        "uri" : "https://www.harrassowitz.de/OttoEditions/servlet/OttoEdition?sc=sc_email&BTSubmit=searche&CBSpeedOrder=true&CBTitleId=0&TFTitleId=115003369&ID=009164240",
        "username" : "****",
        "password" : "****",
        "notes" : "all staff have different logons with different permissions",
        "available" : true,
        "delivery_method" : "email",
        "statistics_format" : "HTML",
        "locally_stored" : "false",
        "online_location" : "https://www.harrassowitz.de/",
        "statistics_notes" : ""
      } ],
      "accounts" : [ {
        "name" : "Main library account",
        "account_no" : "xxxx34",
        "description" : "Main library account",
        "app_system_no" : "",
        "payment_method" : "check",
        "account_status" : "Active",
        "contact_info" : "service@harrassowitz.de",
        "library_code" : "COB",
        "library_edi_code" : "765987610",
        "notes" : "different account numbers for serials and standing orders"
      } ],
      "changelogs" : [ {
        "description" : "This is a sample note.",
        "timestamp" : "2008-05-15T10:53:00.000+0000"
      } ]
    }, {
      "id" : "08079d45-611e-46bf-b9c9-49559f981635",
      "name" : "Magnolia Press",
      "code" : "MGNP",
      "description" : "Serials-Foreign",
      "vendor_status" : "Active",
      "language" : "en-us",
      "aliases" : [ {
        "value" : "Mangolia Press NZ",
        "description" : ""
      } ],
      "addresses" : [ {
        "address" : {
          "addressLine1" : "Saint Lukes",
          "addressLine2" : "P.O. Box 41383",
          "city" : "Auckland",
          "stateRegion" : "",
          "zipCode" : "1346",
          "country" : "New Zealand"
        },
        "categories" : [ ],
        "language" : "English",
        "san_code" : ""
      } ],
      "phone_numbers" : [ {
        "phone_number" : {
          "country_code" : "64",
          "area_code" : "95",
          "phone_number" : "783-996"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "emails" : [ {
        "email" : {
          "value" : "magnolia@mapress.com",
          "description" : "Customer Service"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "urls" : [ {
        "url" : {
          "value" : "http://www.mapress.com/j/",
          "description" : "main website"
        },
        "language" : "en-us",
        "categories" : [ ],
        "notes" : ""
      } ],
      "contacts" : [ {
        "contact_person" : {
          "prefix" : "Mrs.",
          "first_name" : "Siouxsie",
          "last_name" : "Sioux ",
          "language" : "English",
          "notes" : "",
          "phone_number" : {
            "country_code" : "64",
            "area_code" : "95",
            "phone_number" : "783-996"
          },
          "email" : {
            "value" : "Siouxsie@mapress.com",
            "description" : "Licenses"
          },
          "address" : {
            "addressLine1" : "Saint Lukes",
            "addressLine2" : "Unit 5",
            "city" : "Auckland",
            "stateRegion" : "",
            "zipCode" : "",
            "country" : "New Zealand"
          },
          "url" : {
            "value" : "https://www.doi.gov/",
            "description" : "web address for U.S. Dept. of Interior"
          }
        },
        "language" : "English",
        "categories" : [ ]
      } ],
      "agreements" : [ {
        "name" : "Zootaxa ",
        "discount" : 10.0,
        "reference_url" : "F:\\Serials\\Licensing\\License and Renewal Agreements\\Content Providers\\Magnolia Press",
        "notes" : "Acquisition of 2008-2010 Journal Archives"
      } ],
      "erp_code" : "G64758-74829",
      "payment_method" : "EFT",
      "access_provider" : true,
      "governmental" : false,
      "licensor" : true,
      "material_supplier" : true,
      "vendor_currencies" : [ "NZD" ],
      "claiming_interval" : 0,
      "discount_percent" : 0.0,
      "expected_activation_interval" : 30,
      "expected_invoice_interval" : 30,
      "renewal_activation_interval" : 365,
      "subscription_interval" : 365,
      "tax_id" : "1819468",
      "liable_for_vat" : false,
      "tax_percentage" : 5.0,
      "edi" : {
        "vendor_edi_code" : "",
        "vendor_edi_type" : "",
        "lib_edi_code" : "",
        "lib_edi_type" : "",
        "prorate_tax" : false,
        "prorate_fees" : false,
        "edi_naming_convention" : "",
        "send_acct_num" : false,
        "support_order" : false,
        "support_invoice" : false,
        "notes" : "",
        "edi_ftp" : {
          "ftp_format" : "",
          "server_address" : "",
          "username" : "",
          "password" : "",
          "ftp_mode" : "",
          "ftp_conn_mode" : "",
          "ftp_port" : "22",
          "order_directory" : "",
          "invoice_directory" : "",
          "notes" : ""
        },
        "edi_job" : {
          "schedule_edi" : false,
          "is_monday" : false,
          "is_tuesday" : false,
          "is_wednesday" : false,
          "is_thursday" : false,
          "is_friday" : false,
          "is_saturday" : false,
          "is_sunday" : false,
          "send_to_emails" : "",
          "notify_all_edi" : false,
          "notify_invoice_only" : false,
          "notify_error_only" : false
        }
      },
      "interfaces" : [ {
        "name" : "Mapress",
        "uri" : "http://www.mapress.com/j/",
        "username" : "",
        "password" : "",
        "notes" : "",
        "available" : false,
        "delivery_method" : "",
        "statistics_format" : "",
        "locally_stored" : "",
        "online_location" : "",
        "statistics_notes" : ""
      } ],
      "accounts" : [ {
        "name" : "Serials",
        "account_no" : "xxxx7859",
        "description" : "Libraries",
        "app_system_no" : "",
        "payment_method" : "EFT",
        "account_status" : "Active",
        "contact_info" : "magnolia@mapress.com",
        "library_code" : "COB",
        "library_edi_code" : "765987610",
        "notes" : ""
      } ],
      "changelogs" : [ {
        "description" : "This is a sample note.",
        "timestamp" : "2008-05-15T10:53:00.000+0000"
      } ]
    }, {
      "id" : "9789381f-cad2-479b-9021-a50932f4aa8c",
      "name" : "Taylor & Francis Group, LLC ",
      "code" : "TAFG",
      "description" : "Serials - Domestic",
      "vendor_status" : "Active",
      "language" : "en-us",
      "aliases" : [ {
        "value" : "Taylor & Francis ",
        "description" : ""
      } ],
      "addresses" : [ {
        "address" : {
          "addressLine1" : "Suite 300, 6000 Broken Sound Parkway, NW",
          "addressLine2" : "",
          "city" : "Boca Raton",
          "stateRegion" : "FL",
          "zipCode" : "33487",
          "country" : "USA"
        },
        "categories" : [ "Customer Service", "Payments" ],
        "language" : "English",
        "san_code" : ""
      } ],
      "phone_numbers" : [ {
        "phone_number" : {
          "country_code" : "1",
          "area_code" : "800",
          "phone_number" : "634-7064"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "emails" : [ {
        "email" : {
          "value" : "enquiries@taylorandfrancis.com",
          "description" : "Customer Servicel"
        },
        "categories" : [ ],
        "language" : "English"
      } ],
      "urls" : [ {
        "url" : {
          "value" : "http://taylorandfrancis.com/",
          "description" : "main website"
        },
        "language" : "en-us",
        "categories" : [ ],
        "notes" : ""
      } ],
      "contacts" : [ {
        "contact_person" : {
          "prefix" : "Mr.",
          "first_name" : "John-Joe",
          "last_name" : "Taylor",
          "language" : "English",
          "notes" : "",
          "phone_number" : {
            "country_code" : "1",
            "area_code" : "800",
            "phone_number" : "634-8888"
          },
          "email" : {
            "value" : "john-joe.taylor@taylorandfrancis.com",
            "description" : "General"
          },
          "address" : {
            "addressLine1" : "Suite 300, 6000 Broken Sound Parkway, NW",
            "addressLine2" : "",
            "city" : "Boca Raton",
            "stateRegion" : "FL",
            "zipCode" : "",
            "country" : "USA"
          },
          "url" : {
            "value" : "https://www.doi.gov/",
            "description" : "web address for U.S. Dept. of Interior"
          }
        },
        "language" : "English",
        "categories" : [ ]
      } ],
      "agreements" : [ {
        "name" : "Association of Digital Humanities Journal Package",
        "discount" : 40.0,
        "reference_url" : "F:\\Sample\\Licensing\\License and Renewal Agreements\\Content Providers\\Taylor & Francis",
        "notes" : "Amendment to Multiyear Master Agreement (2015-2019)"
      } ],
      "erp_code" : "G64758-74832",
      "payment_method" : "EFT",
      "access_provider" : true,
      "governmental" : false,
      "licensor" : true,
      "material_supplier" : true,
      "vendor_currencies" : [ "USD" ],
      "claiming_interval" : 0,
      "discount_percent" : 0.0,
      "expected_activation_interval" : 30,
      "expected_invoice_interval" : 30,
      "renewal_activation_interval" : 365,
      "subscription_interval" : 365,
      "tax_id" : "",
      "liable_for_vat" : false,
      "tax_percentage" : 0.0,
      "edi" : {
        "vendor_edi_code" : "",
        "vendor_edi_type" : "",
        "lib_edi_code" : "",
        "lib_edi_type" : "",
        "prorate_tax" : false,
        "prorate_fees" : false,
        "edi_naming_convention" : "",
        "send_acct_num" : false,
        "support_order" : false,
        "support_invoice" : false,
        "notes" : "",
        "edi_ftp" : {
          "ftp_format" : "",
          "server_address" : "",
          "username" : "",
          "password" : "",
          "ftp_mode" : "",
          "ftp_conn_mode" : "",
          "ftp_port" : "22",
          "order_directory" : "",
          "invoice_directory" : "",
          "notes" : ""
        },
        "edi_job" : {
          "schedule_edi" : false,
          "is_monday" : false,
          "is_tuesday" : false,
          "is_wednesday" : false,
          "is_thursday" : false,
          "is_friday" : false,
          "is_saturday" : false,
          "is_sunday" : false,
          "send_to_emails" : "",
          "notify_all_edi" : false,
          "notify_invoice_only" : false,
          "notify_error_only" : false
        }
      },
      "interfaces" : [ {
        "name" : "Taylor & Francis Online",
        "uri" : "https://www.tandfonline.com",
        "username" : "",
        "password" : "",
        "notes" : "",
        "available" : true,
        "delivery_method" : "online",
        "statistics_format" : "COUNTER",
        "locally_stored" : "https://www.lib.sample.edu/staff/collectiondevelopment/",
        "online_location" : "https://accounts.taylorfrancis.com/identity/#/login",
        "statistics_notes" : ""
      } ],
      "accounts" : [ {
        "name" : "Serialst",
        "account_no" : "xxxx4962",
        "description" : "Libraries",
        "app_system_no" : "",
        "payment_method" : "EFT",
        "account_status" : "Active",
        "contact_info" : "Richard.Plantagenet@taylorandfrancis.com",
        "library_code" : "COB",
        "library_edi_code" : "765987610",
        "notes" : ""
      } ],
      "changelogs" : [ {
        "description" : "This is a sample note.",
        "timestamp" : "2008-05-15T10:53:00.000+0000"
      } ]
    }, {
      "id" : "34856c85-80db-4c05-abb0-f2776030d0b9",
      "name" : "EBSCO SUBSCRIPTION SERVICES",
      "code" : "SREBSCO",
      "description" : "Use for single title subscriptions.",
      "vendor_status" : "Active",
      "language" : "en-us",
      "aliases" : [ {
        "value" : "EBSCO",
        "description" : ""
      } ],
      "addresses" : [ {
        "address" : {
          "addressLine1" : "10 ESTES ST",
          "addressLine2" : "PO BOX 682",
          "city" : "Ipswich",
          "stateRegion" : "MA",
          "zipCode" : "01938",
          "country" : "USA"
        },
        "categories" : [ ],
        "language" : "en",
        "san_code" : "1234567"
      } ],
      "phone_numbers" : [ {
        "phone_number" : {
          "country_code" : "1",
          "area_code" : "800",
          "phone_number" : "653-2726"
        },
        "categories" : [ ],
        "language" : "en-us"
      } ],
      "emails" : [ {
        "email" : {
          "value" : "jbeck@ebsco.com",
          "description" : "Customer Service Rep"
        },
        "categories" : [ ],
        "language" : "en-us"
      } ],
      "urls" : [ {
        "url" : {
          "value" : "www.ebsco.com",
          "description" : "main website"
        },
        "language" : "en-us",
        "categories" : [ ],
        "notes" : ""
      } ],
      "contacts" : [ {
        "contact_person" : {
          "prefix" : "",
          "first_name" : "Josh",
          "last_name" : "Beck",
          "language" : "en-us",
          "notes" : "",
          "phone_number" : {
            "country_code" : "US",
            "area_code" : "877",
            "phone_number" : "763-6348"
          },
          "email" : {
            "value" : "noreply@folio.org",
            "description" : "Main"
          },
          "address" : {
            "addressLine1" : "10 ESTES ST",
            "addressLine2" : "PO BOX 682",
            "city" : "Ipswich",
            "stateRegion" : "MA",
            "zipCode" : "01938",
            "country" : "USA"
          },
          "url" : {
            "value" : "https://www.doi.gov/",
            "description" : "web address for U.S. Dept. of Interior"
          }
        },
        "language" : "en-us",
        "categories" : [ ]
      } ],
      "agreements" : [ {
        "name" : "XXXXXX credit",
        "discount" : 0.0,
        "reference_url" : "",
        "notes" : ""
      } ],
      "erp_code" : "G64758-74837",
      "payment_method" : "EFT",
      "access_provider" : false,
      "governmental" : false,
      "licensor" : false,
      "material_supplier" : false,
      "vendor_currencies" : [ "USD" ],
      "claiming_interval" : 60,
      "discount_percent" : 10.0,
      "expected_activation_interval" : 0,
      "expected_invoice_interval" : 30,
      "renewal_activation_interval" : 0,
      "subscription_interval" : 0,
      "tax_id" : "",
      "liable_for_vat" : false,
      "tax_percentage" : 0.0,
      "edi" : {
        "vendor_edi_code" : "xx-xxx014186",
        "vendor_edi_type" : "31B",
        "lib_edi_code" : "VOY0081",
        "lib_edi_type" : "31B",
        "prorate_tax" : true,
        "prorate_fees" : false,
        "edi_naming_convention" : "*.edu",
        "send_acct_num" : true,
        "support_order" : false,
        "support_invoice" : true,
        "notes" : "",
        "edi_ftp" : {
          "ftp_format" : "SFTP",
          "server_address" : "ftp.ebsco.com",
          "username" : "edi_username",
          "password" : "edi_password",
          "ftp_mode" : "binary",
          "ftp_conn_mode" : "Passive",
          "ftp_port" : "22",
          "order_directory" : "",
          "invoice_directory" : "",
          "notes" : ""
        },
        "edi_job" : {
          "schedule_edi" : false,
          "is_monday" : false,
          "is_tuesday" : false,
          "is_wednesday" : false,
          "is_thursday" : false,
          "is_friday" : false,
          "is_saturday" : false,
          "is_sunday" : false,
          "send_to_emails" : "bobbarker@priceisright.com",
          "notify_all_edi" : false,
          "notify_invoice_only" : true,
          "notify_error_only" : false
        }
      },
      "interfaces" : [ {
        "name" : "EBSCONet",
        "uri" : "https://www.ebsconet.com/",
        "username" : "username",
        "password" : "password",
        "notes" : "all staff have different logins and permissions associated with them",
        "available" : true,
        "delivery_method" : "Email",
        "statistics_format" : "Excel",
        "locally_stored" : "false",
        "online_location" : "",
        "statistics_notes" : ""
      } ],
      "accounts" : [ {
        "name" : "Serials",
        "account_no" : "BRXXXXX-01",
        "description" : "Print serial subscriptions",
        "app_system_no" : "",
        "payment_method" : "EFT",
        "account_status" : "Active",
        "contact_info" : "Some basic contact information note.",
        "library_code" : "-01, -02, -03",
        "library_edi_code" : "VOY0081",
        "notes" : ""
      } ],
      "changelogs" : [ {
        "description" : "This is a sample note.",
        "timestamp" : "2008-05-15T10:53:00.000+0000"
      } ]
    } ],
    "total_records" : 13,
    "first" : 1,
    "last" : 10
  });

  this.get('/users', {
    "users" : [ {
      "username" : "diku_admin",
      "id" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502",
      "active" : true,
      "proxyFor" : [ ],
      "personal" : {
        "lastName" : "ADMINISTRATOR",
        "firstName" : "DIKU",
        "email" : "admin@diku.example.org",
        "addresses" : [ ]
      },
      "createdDate" : "2018-10-26T02:40:19.771+0000",
      "updatedDate" : "2018-10-26T02:40:19.771+0000"
    }, {
      "username" : "bertrand",
      "id" : "22b1cb27-fb68-49a6-9e9d-f2b2061d0702",
      "barcode" : "377883675731460",
      "active" : false,
      "type" : "patron",
      "patronGroup" : "c26af390-ffb3-4a05-afda-f4bbccc6d39f",
      "proxyFor" : [ ],
      "personal" : {
        "lastName" : "Crona",
        "firstName" : "Lauren",
        "middleName" : "Elizabeth",
        "email" : "clotilde@dubuque-windler-and-glover.cd",
        "phone" : "1-742-956-4036 x609",
        "dateOfBirth" : "1992-07-16T00:00:00.000+0000",
        "addresses" : [ {
          "countryId" : "US",
          "addressLine1" : "35495 Zetta Rapids",
          "city" : "Fairbanks",
          "region" : "MT",
          "postalCode" : "06806-5468",
          "addressTypeId" : "7bee8904-2251-43b4-a483-4de36f696954",
          "primaryAddress" : true
        } ],
        "preferredContactTypeId" : "002"
      },
      "enrollmentDate" : "2017-05-02T00:00:00.000+0000",
      "expirationDate" : "2019-10-21T00:00:00.000+0000",
      "createdDate" : "2018-10-26T02:53:46.416+0000",
      "updatedDate" : "2018-10-26T02:53:46.416+0000",
      "metadata" : {
        "createdDate" : "2018-10-26T02:53:46.389+0000",
        "createdByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502",
        "updatedDate" : "2018-10-26T02:53:46.389+0000",
        "updatedByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502"
      }
    }, {
      "username" : "gideon",
      "id" : "8fb51b0b-8ba4-4e22-92dc-9cca46fc2034",
      "barcode" : "561099092335968",
      "active" : false,
      "type" : "patron",
      "patronGroup" : "c26af390-ffb3-4a05-afda-f4bbccc6d39f",
      "proxyFor" : [ ],
      "personal" : {
        "lastName" : "Welch",
        "firstName" : "Kaden",
        "middleName" : "Bobbie",
        "email" : "tiana@bosco-schowalter-and-eichmann.md.us",
        "phone" : "449.672.2686 x393",
        "mobilePhone" : "1-702-547-8837",
        "dateOfBirth" : "2003-09-26T00:00:00.000+0000",
        "addresses" : [ {
          "countryId" : "US",
          "addressLine1" : "28431 Schamberger Lane",
          "city" : "Terre Haute",
          "region" : "WA",
          "postalCode" : "16720",
          "addressTypeId" : "7bee8904-2251-43b4-a483-4de36f696954",
          "primaryAddress" : true
        } ],
        "preferredContactTypeId" : "001"
      },
      "enrollmentDate" : "2018-02-24T00:00:00.000+0000",
      "expirationDate" : "2020-06-04T00:00:00.000+0000",
      "createdDate" : "2018-10-26T02:53:47.266+0000",
      "updatedDate" : "2018-10-26T02:53:47.266+0000",
      "metadata" : {
        "createdDate" : "2018-10-26T02:53:47.253+0000",
        "createdByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502",
        "updatedDate" : "2018-10-26T02:53:47.253+0000",
        "updatedByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502"
      }
    }, {
      "username" : "brenna",
      "id" : "a5a29edf-ae97-4b3a-904f-20ab2e3bf13d",
      "barcode" : "222560072975916",
      "active" : false,
      "type" : "patron",
      "patronGroup" : "c26af390-ffb3-4a05-afda-f4bbccc6d39f",
      "proxyFor" : [ ],
      "personal" : {
        "lastName" : "Huels",
        "firstName" : "Thaddeus",
        "middleName" : "Constance",
        "email" : "alvina@nitzsche-streich-and-senger.mo.us",
        "phone" : "733-377-3628 x1518",
        "dateOfBirth" : "1982-11-03T00:00:00.000+0000",
        "addresses" : [ {
          "countryId" : "US",
          "addressLine1" : "78889 Office",
          "city" : "Sonoma",
          "region" : "IA",
          "postalCode" : "09383",
          "addressTypeId" : "7bee8904-2251-43b4-a483-4de36f696954",
          "primaryAddress" : true
        } ],
        "preferredContactTypeId" : "003"
      },
      "enrollmentDate" : "2015-06-06T00:00:00.000+0000",
      "expirationDate" : "2020-01-27T00:00:00.000+0000",
      "createdDate" : "2018-10-26T02:53:48.213+0000",
      "updatedDate" : "2018-10-26T02:53:48.213+0000",
      "metadata" : {
        "createdDate" : "2018-10-26T02:53:48.202+0000",
        "createdByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502",
        "updatedDate" : "2018-10-26T02:53:48.202+0000",
        "updatedByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502"
      }
    }, {
      "username" : "jadyn",
      "id" : "4bf2f725-504f-4a09-ade6-bbe954813a5b",
      "barcode" : "711471818530796",
      "active" : true,
      "type" : "patron",
      "patronGroup" : "ab39664d-5f10-46cd-93d9-3a1d61db9c5d",
      "proxyFor" : [ ],
      "personal" : {
        "lastName" : "Nikolaus",
        "firstName" : "Elody",
        "email" : "elda@mcclure-cassin-and-kuhic.mp",
        "phone" : "1-284-606-4306 x61508",
        "dateOfBirth" : "1970-07-29T00:00:00.000+0000",
        "addresses" : [ {
          "countryId" : "US",
          "addressLine1" : "67040 Marcelino Trafficway #769",
          "city" : "Corona",
          "region" : "SD",
          "postalCode" : "56898",
          "addressTypeId" : "c5d26162-d628-42de-8b72-f4578b6a5ecd",
          "primaryAddress" : true
        } ],
        "preferredContactTypeId" : "002"
      },
      "enrollmentDate" : "2015-03-12T00:00:00.000+0000",
      "expirationDate" : "2020-01-11T00:00:00.000+0000",
      "createdDate" : "2018-10-26T02:53:49.042+0000",
      "updatedDate" : "2018-10-26T02:53:49.042+0000",
      "metadata" : {
        "createdDate" : "2018-10-26T02:53:49.029+0000",
        "createdByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502",
        "updatedDate" : "2018-10-26T02:53:49.029+0000",
        "updatedByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502"
      }
    }, {
      "username" : "gianni",
      "id" : "bfff7894-c92c-42a3-9dcd-583415c65d65",
      "barcode" : "210227762412742",
      "active" : false,
      "type" : "patron",
      "patronGroup" : "c26af390-ffb3-4a05-afda-f4bbccc6d39f",
      "proxyFor" : [ ],
      "personal" : {
        "lastName" : "Spencer",
        "firstName" : "Candice",
        "middleName" : "Heloise",
        "email" : "cicero@paucek-collins-and-abshire.cy",
        "phone" : "1-823-854-6277 x6047",
        "mobilePhone" : "(793)609-3694",
        "dateOfBirth" : "1993-12-23T00:00:00.000+0000",
        "addresses" : [ {
          "countryId" : "US",
          "addressLine1" : "11416 Herbert Forges",
          "city" : "San Jose",
          "region" : "TX",
          "postalCode" : "82197-5700",
          "addressTypeId" : "7bee8904-2251-43b4-a483-4de36f696954",
          "primaryAddress" : true
        } ],
        "preferredContactTypeId" : "001"
      },
      "enrollmentDate" : "2015-02-17T00:00:00.000+0000",
      "expirationDate" : "2019-05-29T00:00:00.000+0000",
      "createdDate" : "2018-10-26T02:53:49.895+0000",
      "updatedDate" : "2018-10-26T02:53:49.895+0000",
      "metadata" : {
        "createdDate" : "2018-10-26T02:53:49.886+0000",
        "createdByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502",
        "updatedDate" : "2018-10-26T02:53:49.886+0000",
        "updatedByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502"
      }
    }, {
      "username" : "samantha",
      "id" : "38e304ab-afdc-4db1-b1ff-214945a66611",
      "barcode" : "890565865079004",
      "active" : true,
      "type" : "patron",
      "patronGroup" : "16614dad-f2dd-4179-9c1a-807e0eb56807",
      "proxyFor" : [ ],
      "personal" : {
        "lastName" : "Welch",
        "firstName" : "Mireille",
        "middleName" : "Irwin",
        "email" : "jeanne@schaefer-boyle.th",
        "phone" : "635-714-3695 x8494",
        "mobilePhone" : "1-112-690-8795 x13948",
        "dateOfBirth" : "1961-06-10T00:00:00.000+0000",
        "addresses" : [ {
          "countryId" : "US",
          "addressLine1" : "47083 Dolores Plains Apt. 493",
          "city" : "Temple City",
          "region" : "AR",
          "postalCode" : "37120-7427",
          "addressTypeId" : "c5d26162-d628-42de-8b72-f4578b6a5ecd",
          "primaryAddress" : true
        } ],
        "preferredContactTypeId" : "002"
      },
      "enrollmentDate" : "2015-11-30T00:00:00.000+0000",
      "expirationDate" : "2020-08-04T00:00:00.000+0000",
      "createdDate" : "2018-10-26T02:53:50.740+0000",
      "updatedDate" : "2018-10-26T02:53:50.740+0000",
      "metadata" : {
        "createdDate" : "2018-10-26T02:53:50.734+0000",
        "createdByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502",
        "updatedDate" : "2018-10-26T02:53:50.734+0000",
        "updatedByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502"
      }
    }, {
      "username" : "damion",
      "id" : "3d5a40ba-04b8-4904-81c0-78b7135c7ed3",
      "barcode" : "705011373978280",
      "active" : true,
      "type" : "patron",
      "patronGroup" : "16614dad-f2dd-4179-9c1a-807e0eb56807",
      "proxyFor" : [ ],
      "personal" : {
        "lastName" : "Spinka",
        "firstName" : "Mckayla",
        "email" : "kobe@beier-mante-and-roberts.sc.us",
        "phone" : "770-529-2811 x56477",
        "mobilePhone" : "1-855-114-5688 x30364",
        "dateOfBirth" : "2014-11-05T00:00:00.000+0000",
        "addresses" : [ {
          "countryId" : "US",
          "addressLine1" : "99540 Jose Gardens Apt. 004",
          "city" : "Malibu",
          "region" : "VI",
          "postalCode" : "82898",
          "addressTypeId" : "c5d26162-d628-42de-8b72-f4578b6a5ecd",
          "primaryAddress" : true
        } ],
        "preferredContactTypeId" : "003"
      },
      "enrollmentDate" : "2017-10-20T00:00:00.000+0000",
      "expirationDate" : "2020-04-07T00:00:00.000+0000",
      "createdDate" : "2018-10-26T02:53:51.627+0000",
      "updatedDate" : "2018-10-26T02:53:51.627+0000",
      "metadata" : {
        "createdDate" : "2018-10-26T02:53:51.610+0000",
        "createdByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502",
        "updatedDate" : "2018-10-26T02:53:51.610+0000",
        "updatedByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502"
      }
    }, {
      "username" : "loraine",
      "id" : "b889bdac-9226-4084-9137-bd2afca72c01",
      "barcode" : "121052374380692",
      "active" : false,
      "type" : "patron",
      "patronGroup" : "ab39664d-5f10-46cd-93d9-3a1d61db9c5d",
      "proxyFor" : [ ],
      "personal" : {
        "lastName" : "Tromp",
        "firstName" : "Caterina",
        "middleName" : "Eino",
        "email" : "ines@pfannerstill-reichert-and-langosh.museum",
        "phone" : "767.393.1111 x92676",
        "dateOfBirth" : "1944-06-18T00:00:00.000+0000",
        "addresses" : [ {
          "countryId" : "US",
          "addressLine1" : "53095 Coby Mill Suite 265",
          "city" : "Apple Valley",
          "region" : "NJ",
          "postalCode" : "99961",
          "addressTypeId" : "c5d26162-d628-42de-8b72-f4578b6a5ecd",
          "primaryAddress" : true
        } ],
        "preferredContactTypeId" : "005"
      },
      "enrollmentDate" : "2015-02-01T00:00:00.000+0000",
      "expirationDate" : "2019-04-01T00:00:00.000+0000",
      "createdDate" : "2018-10-26T02:53:52.481+0000",
      "updatedDate" : "2018-10-26T02:53:52.481+0000",
      "metadata" : {
        "createdDate" : "2018-10-26T02:53:52.473+0000",
        "createdByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502",
        "updatedDate" : "2018-10-26T02:53:52.473+0000",
        "updatedByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502"
      }
    }, {
      "username" : "annamae",
      "id" : "a7290849-12e8-4641-bc5c-3aa7293c1c73",
      "barcode" : "519479892311213",
      "active" : false,
      "type" : "patron",
      "patronGroup" : "ab39664d-5f10-46cd-93d9-3a1d61db9c5d",
      "proxyFor" : [ ],
      "personal" : {
        "lastName" : "Daniel",
        "firstName" : "Julian",
        "middleName" : "Mckayla",
        "email" : "pete@torphy-keeling-and-halvorson.ye",
        "phone" : "1-695-457-0371",
        "mobilePhone" : "057.957.7728 x133",
        "dateOfBirth" : "1970-08-21T00:00:00.000+0000",
        "addresses" : [ {
          "countryId" : "US",
          "addressLine1" : "06728 Windler Pass Apt. 705",
          "city" : "Costa Mesa",
          "region" : "AZ",
          "postalCode" : "51827-1931",
          "addressTypeId" : "7bee8904-2251-43b4-a483-4de36f696954",
          "primaryAddress" : true
        } ],
        "preferredContactTypeId" : "001"
      },
      "enrollmentDate" : "2017-01-21T00:00:00.000+0000",
      "expirationDate" : "2018-10-29T00:00:00.000+0000",
      "createdDate" : "2018-10-26T02:53:53.328+0000",
      "updatedDate" : "2018-10-26T02:53:53.328+0000",
      "metadata" : {
        "createdDate" : "2018-10-26T02:53:53.320+0000",
        "createdByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502",
        "updatedDate" : "2018-10-26T02:53:53.320+0000",
        "updatedByUserId" : "edd34601-74f9-5c08-bff8-4f2e7fd1a502"
      }
    } ],
    "totalRecords" : 201,
    "resultInfo" : {
      "totalRecords" : 201,
      "facets" : [ ],
      "diagnostics" : [ ]
    }
  });


}
