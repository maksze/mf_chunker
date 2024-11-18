import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player'
import { OnProgressProps } from 'react-player/base';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { InferType } from 'yup';

const WORK_DIR = 'react_webinar_1';

// Схема для фрагмента
const FragmentSchema = Yup.object().shape({
  id: Yup.string().required('ID является обязательным'),
  start: Yup.number().required('Начало является обязательным').min(0, 'Начало должно быть неотрицательным'),
  end: Yup.number().required('Конец является обязательным').min(Yup.ref('start'), 'Конец должен быть больше или равен началу'),
  title: Yup.string().required('Заголовок является обязательным').default(''),
  comment: Yup.string().optional(),
});

type TFragment = InferType<typeof FragmentSchema>

// Схема для начального состояния
const FragmentsSchema = Yup.object().shape({
  fragments: Yup.array().of(FragmentSchema).required('Фрагменты являются обязательными').min(1, 'Должен быть хотя бы один фрагмент').default([]),
});

type TFragments = InferType<typeof FragmentsSchema>

export default function Root() {
  const [propgress, onProgress] = useState<OnProgressProps>();
  const [playing, setPlaying] = useState<boolean>(false);
  const [initialState , setInitialState] = useState<TFragments>(FragmentsSchema.getDefault());
  const ref = useRef<ReactPlayer>(null);

  const seekAndPlay = (seconds: number) => {
    ref?.current?.seekTo(seconds)
    setPlaying(true);
  }

  const stepBefore = (step = 1) => {
    const currentTime = ref?.current?.getCurrentTime() ?? 0;
    ref?.current?.seekTo(currentTime - step)
    setPlaying(true);
  }
  
  const stepAfter= (step = 1) => {
    const currentTime = ref?.current?.getCurrentTime() ?? 0;
    ref?.current?.seekTo(currentTime + step)
    setPlaying(true);
  }

  const getDefaultFragment = (): TFragment => {
    const currentTime = Math.round(ref?.current?.getCurrentTime() ?? 0);
    return {
      id: Date.now().toString(),
      title: 'test',
      start: currentTime,
      end: currentTime + 5,
    }
  }

  useEffect(() => {
    fetch(`http://localhost:3000/video/${WORK_DIR}`, {
      method: 'GET', // Specifies the request method
      headers: {
          'Content-Type': 'application/json' // Indicates the media type of the resource
      },
    }).then(async (res) => {
      const f = await res.json();
      setInitialState(f);
    })
  }, [])

  const handleSubmit = (data: TFragments) => {
    fetch(`http://localhost:3000/video/${WORK_DIR}`, {
      method: 'PATCH', // Specifies the request method
      headers: {
          'Content-Type': 'application/json' // Indicates the media type of the resource
      },
      body: JSON.stringify(data) // Converts the JavaScript object to a JSON string
    })
  }

  return (
    <main>
      <h1>{WORK_DIR}</h1>
      <ReactPlayer
        url={`http://localhost:3000/${WORK_DIR}/source.mp4`}
        onProgress={onProgress}
        playing={playing}
        ref={ref}
        controls
      />

      <pre>{JSON.stringify(propgress)}</pre>
      
      <button onClick={() => stepBefore(5)}>before 5</button>
      <button onClick={() => stepBefore()}>before 1</button>
      <button onClick={() => stepAfter()}>after 1</button>
      <button onClick={() => stepAfter(5)}>after 5</button>

      <Formik
        initialValues={initialState}
        validationSchema={FragmentsSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
          {({ values }) => {
            return (
              <Form>
                <FieldArray
                  name='fragments'
                  render={(arrayHelpers) => (
                    <div>
                      {values.fragments.length > 0 ? (
                        values.fragments.map((fragment: TFragment, index) => {
                          return (
                            <div key={index}>
                              <br />
                              <Field name={`fragments.${index}.title`} placeholder="title" />
                              <Field name={`fragments.${index}.start`} placeholder="start" />
                              <Field name={`fragments.${index}.end`} placeholder="end" />
                              <br />
                              <button onClick={() => seekAndPlay(fragment.start)}>go start</button>
                              <button onClick={() => seekAndPlay(fragment.end)}>go end</button>
                              <br />
                              <button
                                  type="button"
                                  onClick={() => { if(confirm('drop?')) arrayHelpers.remove(index) }} // remove a friend from the list
                                >
                                  -
                                </button>
                                <button
                                  type="button"
                                  onClick={() => arrayHelpers.insert(index, getDefaultFragment())} // insert an empty string at a position
                                >
                                  +
                                </button>
                                <br />
                            </div>
                          )
                        })
                      ) : (
                        <button type="button" onClick={() => arrayHelpers.push(getDefaultFragment())}>add</button>
                      )}
                    </div>
                  )}
                />
                <button type="submit">save</button>
              </Form>
            )
          }}
      </Formik>
    </main>
  );
}
