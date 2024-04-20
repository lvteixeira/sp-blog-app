import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CustomInputText from "../ui/CustomInputText";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import SignupService from "@/service/SignupService";

export default function Signup() {
  const signupService = useRef(new SignupService());
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);
  const router = useRouter();
  const usernameRegex = /^[a-z]+([.-][a-z]+)?$/;
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(usernameRegex, 'Nome de usuário inválido')
      .required('Nome de usuário é obrigatório'),
    email: Yup.string()
      .email('Email inválido')
      .required('Email é obrigatório'),
    secret: Yup.string()
      .required('Senha é obrigatória'),
  });

  return(
    <div className="flex align-items-center justify-content-center">
      <div className="surface-card p-4 shadow-4 border-round w-full lg:w-4 mt-3" style={{ height: "500px" }}>
        <div id="header-signup" className="text-center mt-2">
          <div className="text-900 text-3xl font-medium">Crie sua conta</div>
        </div>
        <Toast ref={toast} />
        <Formik
          initialValues={{ username: '', email: '', secret: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setIsLoading(true);
            try {
              const res = await signupService.current.createAccount({ username: values.username, email: values.email, password: values.secret });
              toast.current.show({ severity: 'success', detail: 'Conta criada com sucesso.', life: 2600 });
              router.push("/signin");
            } catch (error) {
              toast.current.show({ severity: 'error', detail: error.message, life: 2600 });
            }
            setIsLoading(false);
          }}
        >
          {({ handleSubmit, values, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <div id="form-body" className="mt-4">
                <CustomInputText
                  name="username"
                  type="text"
                  placeholder="Escolha um nome amigável"
                  label="Nome de Usuário"
                />
                <CustomInputText
                  name="email"
                  type="email"
                  placeholder="Seu melhor email"
                  label="Email"
                />
                <CustomInputText
                  name="secret"
                  type="password"
                  placeholder="Senha"
                  label="Senha"
                />
                <div>
                  <Button type="submit" label="Registrar-se"
                    disabled={!(values.username && values.email && values.secret) || Object.keys(errors).length !== 0}
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