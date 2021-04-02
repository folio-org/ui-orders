const printTemplate = `
    <div>
      <Row end="xs">
        <Col
          xs={6}
          lg={3}
        >
          test1
        </Col>
      </Row>
      <Row>
        <Col
          xs={6}
          lg={3}
        >
          test 2
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          test 3
        </Col>
      </Row>
      <table>
        <tbody>
          <tr>
            <td>Lib name</td>
            <td>Purchase order</td>
          </tr>
          <tr>
            <td rowSpan="2">Bill to address: </td>
            <td>Date:</td>
          </tr>
          <tr>
            <td>PO#: {{poNumber}}</td>
          </tr>
          <tr>
            <td>Vendor</td>
            <td>Ship to</td>
          </tr>
        </tbody>
      </table>
      <div class="table">
        <div class="row">
          <div>POL#</div>
          <div>Description</div>
          <div>quantity_physical</div>
          <div>quantity_electronic</div>
          <div>currency</div>
          <div>Unit price</div>
          <div>list_price_electronic</div>
          <div>additional_cost</div>
          <div>discount</div>
          <div>po_line_estimated_price</div>
          <div>fund_code</div>
          <div>product_id</div>
          <div>product_id_type</div>
          <div>productIdQualifier</div>
          <div>material_type_p</div>
          <div>acquisition_method</div>
          <div>title</div>
          <div>publication_date</div>
          <div>publisher</div>
          <div>rush</div>
          <div>instruction_to_vendor</div>
        </div>
        <div class="row">
          <div>POL#</div>
          <div>Description</div>
          <div>quantity_physical</div>
          <div>quantity_electronic</div>
          <div>currency</div>
          <div>Unit price</div>
          <div>list_price_electronic</div>
          <div>additional_cost</div>
          <div>discount</div>
          <div>po_line_estimated_price</div>
          <div>fund_code</div>
          <div>product_id</div>
          <div>product_id_type</div>
          <div>productIdQualifier</div>
          <div>material_type_p</div>
          <div>acquisition_method</div>
          <div>title</div>
          <div>publication_date</div>
          <div>publisher</div>
          <div>rush</div>
          <div>instruction_to_vendor</div>
        </div>
      </div>
    </div>
`;

export default printTemplate;
