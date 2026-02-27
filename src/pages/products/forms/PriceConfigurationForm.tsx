import { Card, Col, Form, InputNumber, Row, Typography } from "antd";
import type { Category } from "../../../Types";

type Props = {
  selectedCategory: Category | null;
};

const PriceConfigurationForm = ({ selectedCategory }: Props) => {
  if (!selectedCategory) return null;

  return (
    <Card title="Price Configuration" bordered={false}>
      {Object.entries(selectedCategory.priceConfiguration).map(
        ([configKey, config]) => (
          <div key={configKey} style={{ marginBottom: 16 }}>
            <Typography.Text
              strong
              style={{
                display: "block",
                marginBottom: 8,
                textTransform: "capitalize",
              }}
            >
              {configKey}{" "}
              <Typography.Text
                type="secondary"
                style={{ fontWeight: "normal" }}
              >
                ({config.priceType})
              </Typography.Text>
            </Typography.Text>
            <Row gutter={16}>
              {config.availableOptions.map((option) => (
                <Col span={8} key={option}>
                  <Form.Item
                    label={
                      <span style={{ textTransform: "capitalize" }}>
                        {option}
                      </span>
                    }
                    name={["priceConfiguration", configKey, option]}
                    rules={[
                      {
                        required: true,
                        message: `Enter price for ${option}`,
                      },
                    ]}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      addonBefore="₹"
                      placeholder="0"
                      min={0}
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </div>
        ),
      )}
    </Card>
  );
};

export default PriceConfigurationForm;
