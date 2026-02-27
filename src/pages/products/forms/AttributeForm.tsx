import { Card, Col, Form, Radio, Row, Switch, Typography } from "antd";
import type { Category } from "../../../Types";

type Props = {
  selectedCategory: Category | null;
};

const AttributeForm = ({ selectedCategory }: Props) => {
  if (!selectedCategory) return null;

  return (
    <Card title="Attributes" bordered={false}>
      <Row gutter={[16, 8]}>
        {selectedCategory.attributes.map((attr) => (
          <Col span={attr.widgetType === "switch" ? 8 : 24} key={attr.name}>
            {attr.widgetType === "switch" ? (
              <Form.Item
                label={
                  <Typography.Text style={{ textTransform: "capitalize" }}>
                    {attr.name}
                  </Typography.Text>
                }
                name={["attributes", attr.name]}
                valuePropName="checked"
                initialValue={attr.defaultValue === "true"}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            ) : (
              <Form.Item
                label={
                  <Typography.Text style={{ textTransform: "capitalize" }}>
                    {attr.name}
                  </Typography.Text>
                }
                name={["attributes", attr.name]}
                initialValue={attr.defaultValue}
                rules={[
                  {
                    required: true,
                    message: `Please select ${attr.name}`,
                  },
                ]}
              >
                <Radio.Group>
                  {attr.availableOptions.map((option) => (
                    <Radio.Button key={option} value={option}>
                      {option}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            )}
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default AttributeForm;
