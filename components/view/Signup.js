import React, { useState } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CustomInputText from "../ui/CustomInputText.js";
import { Button } from "primereact/button";
import SignupService from "@/service/SignupService.js";

export default function Signup() {
  const signupService = new SignupService();
  const usernameRegex = /^[a-z]+([.-][a-z]+)?$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(usernameRegex, 'Nome de usuário inválido')
      .required('Nome de usuário é obrigatório'),
    email: Yup.string()
      .matches(emailRegex, 'Email inválido')
      .required('Email é obrigatório'),
    secret: Yup.string()
      .required('Senha é obrigatória'),
  });
  const [isLoading, setIsLoading] = useState(false);
  return(
    <div className="flex align-items-center justify-content-center">
        <div className="surface-card p-4 shadow-4 border-round w-full lg:w-4 mt-3" style={{height: "500px"}}>
            <div id="header-signup"className="text-center mt-2">
                <div className="text-900 text-3xl font-medium">Crie sua conta</div>
            </div>
            <Formik
              initialValues={{ username: '', email: '', secret: '' }}
              validationSchema={validationSchema}
              onSubmit={async(values, { setSubmitting }) => {
                console.log("calling SignupService");
                setIsLoading(true);
                await signupService.createAccount(values);
                setIsLoading(false);
              }}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <div id="form-body" className="mt-4">
                      <CustomInputText
                        name="username"
                        type="text"
                        placeholder="Escolha um nome amigável"
                        label="Nome de Usuário" // Pass the label prop here
                      />
                      <CustomInputText
                        name="email"
                        type="text"
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