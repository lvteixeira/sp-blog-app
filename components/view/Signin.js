import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Formik, Form } from 'formik';
import CustomInputText from "../ui/CustomInputText";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import SigninService from "@/service/SigninService";

export default function Signin() {
  const signinService = useRef(new SigninService());
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);
  const router = useRouter();

  return(
    <div className="flex align-items-center justify-content-center">
      <div className="surface-card p-4 shadow-4 border-round w-full lg:w-4 mt-3" style={{ height: "450px" }}>
        <div id="header-signin" className="text-center mt-2">
          <div className="text-900 text-3xl font-medium">Login</div>
        </div>
        <Toast ref={toast} />
        <Formik
          initialValues={{ username: '', secret: '' }}
          onSubmit={async (values, { setSubmitting }) => {
            setIsLoading(true);
            try {
              const res = await signinService.current.auth({ username: values.username, password: values.secret });
              sessionStorage.setItem('currentSessionId', res.userId);
              router.push("/home");
            } catch (error) {
              toast.current.show({ severity: 'error', detail: error.response.data, life: 2600 });
            }
            setIsLoading(false);
          }}
        >
          {({ handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
              <div id="form-body" className="mt-4">
                <CustomInputText
                  name="username"
                  type="text"
                  placeholder="Usuário"
                  label="Nome de Usuário"
                />
                <CustomInputText
                  name="secret"
                  type="password"
                  placeholder="Senha"
                  label="Senha"
                />
                <div className="text-center">
                  <Button type="submit" label="Entrar"
                    disabled={!(values.username && values.secret)}
                    loading={isLoading}
                    className="w-full shadow-2 mt-3" />
                  <div className="mt-3">
                    <p className="mb-1">Ainda não tem uma conta?</p>
                    <Link href="/signup">
                      <span className="text-primary">Cadastre-se</span>
                    </Link>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}