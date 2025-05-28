import {
  Button,
  Card,
  Row,
  Typography,
  Col,
  Space,
  Input,
  message,
} from "antd";
import PageLayout from "../../components/Layout/PageLayout";
import { createGist } from "../../services/gistService";
import Loader from "../../components/Loader/Loader";
import { useMutation } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CreateGist, CreateGistPayload } from "../../types/appTypes";

const { TextArea } = Input;
const { Title } = Typography;

// Yup schema
const schema = yup.object().shape({
  description: yup.string().required("Description is required"),
  files: yup
    .array()
    .of(
      yup.object().shape({
        filename: yup.string().required("Filename is required"),
        content: yup.string().required("Content is required"),
      })
    )
    .min(1, "At least one file is required")
    .required("At least one file is required"),
});

const CreateGistForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateGist>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: "",
      files: [{ filename: "", content: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "files",
  });

  const createGistMutation = useMutation({
    mutationFn: (payload: CreateGistPayload) => createGist(payload),
    onSuccess: () => {
      message.success("Gist created successfully!");
      reset();
    },
    onError: (error) => {
      message.error("Error creating gist.");
      console.error("Error creating gist:", error);
    },
  });

  const onSubmit = (values: CreateGist) => {
    const formattedFiles = values.files.reduce(
      (acc, file: { filename: string; content: string }) => {
        if (file.filename && file.content) {
          acc[file.filename] = { content: file.content };
        }
        return acc;
      },
      {} as Record<string, { content: string }>
    );
    const payload = {
      description: values.description,
      public: true,
      files: formattedFiles,
    };
    createGistMutation.mutate(payload);
  };

  return (
    <PageLayout>
      {(createGistMutation.isPending || isSubmitting) && <Loader />}
      <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Create Gist
        </Title>
      </Row>
      <Row justify="center">
        <Col
          xs={24}
          sm={20}
          md={16}
          lg={14}
          xl={12}
          xxl={10}
          style={{ maxWidth: 700, width: "100%" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: 16 }}>
              <label>Description</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="This is a Gist Description" />
                )}
              />
              {errors.description && (
                <div style={{ color: "red" }}>{errors.description.message}</div>
              )}
            </div>
            {fields.map((field, index) => (
              <Card key={field.id} style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Space
                    style={{ justifyContent: "space-between", width: "100%" }}
                  >
                    <div style={{ flex: 1 }}>
                      <label>Filename</label>
                      <Controller
                        name={`files.${index}.filename`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Filename including extension…"
                          />
                        )}
                      />
                      {errors.files?.[index]?.filename && (
                        <div style={{ color: "red" }}>
                          {errors.files[index]?.filename?.message}
                        </div>
                      )}
                    </div>
                    <Button
                      danger
                      onClick={() => {
                        if (fields.length > 1) {
                          remove(index);
                        }
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M13.3337 1.45833V2.5H17.7087C18.0538 2.5 18.3337 2.77982 18.3337 3.125C18.3337 3.47018 18.0538 3.75 17.7087 3.75H2.29199C1.94681 3.75 1.66699 3.47018 1.66699 3.125C1.66699 2.77982 1.94681 2.5 2.29199 2.5H6.66699V1.45833C6.66699 0.652918 7.31991 0 8.12533 0H11.8753C12.6807 0 13.3337 0.652918 13.3337 1.45833ZM7.91699 1.45833C7.91699 1.34327 8.01027 1.25 8.12533 1.25H11.8753C11.9904 1.25 12.0837 1.34327 12.0837 1.45833V2.5H7.91699V1.45833Z"
                          fill="#E30000"
                        />
                        <path
                          d="M4.16413 5.14812C4.13088 4.80455 3.82541 4.55298 3.48183 4.58623C3.13826 4.61948 2.88669 4.92496 2.91994 5.26853L4.09707 17.4321C4.16941 18.1796 4.79761 18.75 5.54862 18.75H14.4521C15.2031 18.75 15.8313 18.1796 15.9037 17.4321L17.0808 5.26853C17.114 4.92496 16.8625 4.61948 16.5189 4.58623C16.1753 4.55298 15.8699 4.80455 15.8366 5.14812L14.6595 17.3117C14.6492 17.4185 14.5594 17.5 14.4521 17.5H5.54862C5.44133 17.5 5.35159 17.4185 5.34125 17.3117L4.16413 5.14812Z"
                          fill="#E30000"
                        />
                        <path
                          d="M7.67198 6.25107C8.01656 6.2308 8.31233 6.49371 8.3326 6.83829L8.74927 13.9216C8.76954 14.2662 8.50663 14.562 8.16205 14.5822C7.81746 14.6025 7.52169 14.3396 7.50142 13.995L7.08476 6.9117C7.06449 6.56711 7.32739 6.27134 7.67198 6.25107Z"
                          fill="#E30000"
                        />
                        <path
                          d="M12.9159 6.9117C12.9362 6.56711 12.6733 6.27134 12.3287 6.25107C11.9841 6.2308 11.6884 6.49371 11.6681 6.83829L11.2514 13.9216C11.2312 14.2662 11.4941 14.562 11.8386 14.5822C12.1832 14.6025 12.479 14.3396 12.4993 13.995L12.9159 6.9117Z"
                          fill="#E30000"
                        />
                      </svg>
                    </Button>
                  </Space>
                  <div>
                    <label>Content</label>
                    <Controller
                      name={`files.${index}.content`}
                      control={control}
                      render={({ field }) => (
                        <TextArea
                          {...field}
                          placeholder="Enter file content…"
                          rows={6}
                        />
                      )}
                    />
                    {errors.files?.[index]?.content && (
                      <div style={{ color: "red" }}>
                        {errors.files[index]?.content?.message}
                      </div>
                    )}
                  </div>
                </Space>
              </Card>
            ))}
            <Space
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                type="dashed"
                onClick={() => append({ filename: "", content: "" })}
              >
                Add File
              </Button>
              <Button type="primary" htmlType="submit">
                Create Gist
              </Button>
            </Space>
          </form>
        </Col>
      </Row>
    </PageLayout>
  );
};

export default CreateGistForm;
