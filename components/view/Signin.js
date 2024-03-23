import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation.js";
import { Formik, Form } from 'formik';
import CustomInputText from "../ui/CustomInputText.js";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import SigninService from "@/service/SigninService.js";

export default function Signin() {
  const router = useRouter();
  const signinService = new SigninService();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);

  return (
    <div className="flex align-items-center justify-content-center">
      <div className="surface-card p-4 shadow-4 border-round w-full lg:w-4 mt-3" style={{ height: "500px" }}>
        <div id="header-signin" className="text-center mt-2">
          <div className="text-900 text-3xl font-medium">Faça login na sua conta</div>
        </div>
        <Toast ref={toast} />
        <Formik
          initialValues={{ username: null, secret: null }}
          onSubmit={async (values, { setSubmitting }) => {
            let payload = {
              username: values.username,
              password: values.secret,
            }
            setIsLoading(true);
            await signinService.auth(payload)
              .then(res => {
                //toast.current.show({ severity: 'success', detail: 'Autenticação bem sucedida.', life: 2600 });
                sessionStorage.setItem('currentSessionId', res.userId);
                router.push("/home");
              })
              .catch(error => {
                toast.current.show({ severity: 'error', detail: error.response.data, life: 2600 });
              });
            setIsLoading(false);
          }}
        >
          {({ handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
              <div id="form-body" className="mt-4">
                <CustomInputText
                  name="username"
                  type="text"
                  label="Nome de Usuário"
                />
                <CustomInputText
                  name="secret"
                  type="password"
                  placeholder="Senha"
                  label="Senha"
                />
                <div>
                  <Button type="submit" label="Entrar"
                    disabled={!(values.username && values.secret)}
                    loading={isLoading}
                    className="w-full shadow-2 mt-3" />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}