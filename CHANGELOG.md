### 0.4.0 (2020-06-26)

##### Chores

*  checkout master and pull before creating release ([afc95818](https://github.com/JimLiu/atom-state/commit/afc958181f9e3f4179c85b420f2171aba6e0b8e1))

##### New Features

*  Add new method `registerAtomGroup` for store ([361a2e77](https://github.com/JimLiu/atom-state/commit/361a2e77e5ce694b1dcc888656eaebf2179f027d))

#### 0.3.1 (2020-06-20)

##### New Features

- Support options for creating default atom ([95217b57](https://github.com/JimLiu/atom-state/commit/95217b574f04e23c3dd23d860f3811810aa9bc7b))

### 0.3.0 (2020-06-20)

##### Continuous Integration

- Only deploy document if the commit message contains "docs" ([7976826a](https://github.com/JimLiu/atom-state/commit/7976826ace27e87629c107db3a68e44aebf3fe7e))
- Add github action to deploy document ([d57e5c56](https://github.com/JimLiu/atom-state/commit/d57e5c5661887d947dbf90c2440c72e980d06e7c))

##### Documentation Changes

- Add basic documents ([71f89c39](https://github.com/JimLiu/atom-state/commit/71f89c396d0205b6abdb1560bf4a19e5a0c666c0))

##### New Features

- return unsubscribe function for subscribeAtom ([8f171768](https://github.com/JimLiu/atom-state/commit/8f171768114da84e0f193714fd00d713ff08039e))

#### 0.2.1 (2020-06-11)

##### Chores

- Update atom-state version for examples ([e7f94144](https://github.com/JimLiu/atom-state/commit/e7f941445685c594c9ac6a245496429288da9c6d))

##### New Features

- Add an atom as async by default if the default value is promise ([6ac596f8](https://github.com/JimLiu/atom-state/commit/6ac596f87e0150132826cd4835aef25c1b30aba0))

### 0.2.0 (2020-06-10)

##### New Features

- Merge `registerAtom`, `registerAsyncAtom` with `setAtom` ([def9eb17](https://github.com/JimLiu/atom-state/commit/def9eb17dfb71e878cbe071bf0d04684aaa15d6b))

#### 0.1.2 (2020-06-08)

##### Documentation Changes

- Add todos example ([94b4d16d](https://github.com/JimLiu/atom-state/commit/94b4d16df27fdd95bcb15b0a1c2a3cef9dfb0ec7))

##### Refactors

- Use Set for AtomStoreListener ([b1769c02](https://github.com/JimLiu/atom-state/commit/b1769c02025585d0888997dabe8cbb84da38766f))

#### 0.1.1 (2020-06-07)

##### Documentation Changes

- Add counter example ([cafc51e1](https://github.com/JimLiu/atom-state/commit/cafc51e1dad25848802ec8372e70f3c196e74350))

##### Bug Fixes

- ignore /examples for lint ([89190451](https://github.com/JimLiu/atom-state/commit/89190451b6343d41de0aa7edf09ca2fa38b78695))
- fixed issue that can't create atom default value with 0 ([26aaae70](https://github.com/JimLiu/atom-state/commit/26aaae70dd07027f90913ad737a53fd80a53251e))

### 0.1.0 (2020-06-07)

##### Chores

- Add badges ([68b2a03c](https://github.com/JimLiu/atom-state/commit/68b2a03c3df660b72f3e743efcee6740b4986fcb))

##### Bug Fixes

- useSetAtomState should not cause re-render ([7a4fe2c6](https://github.com/JimLiu/atom-state/commit/7a4fe2c6a3fb7d4096d82a18d44344dadf96692d))

#### 0.0.8 (2020-06-07)

##### Continuous Integration

- publish npm on release ([a38c288a](https://github.com/JimLiu/atom-state/commit/a38c288a013e76471b673ee2b60c4a7edbd8d157))

##### New Features

- Add new hooks useAtomValue and useSetAtomState ([12f1adba](https://github.com/JimLiu/atom-state/commit/12f1adba873c6d25ffc1080b2c6cbe2d23a2f495))

#### 0.0.7 (2020-06-07)

#### 0.0.6 (2020-06-07)

##### Chores

- add release scripts ([68a05380](https://github.com/JimLiu/atom-state/commit/68a053803ea92285c5f1025d4a33347a3179f8b0))

##### Documentation Changes

- Update changelog ([f750e32f](https://github.com/JimLiu/atom-state/commit/f750e32f84d58b2f5f92d85e62c036b89c7a0b5e))

##### New Features

- Support Async Atom ([83cf3fbf](https://github.com/JimLiu/atom-state/commit/83cf3fbf6d5e9fb78a0dda5f5cc22ea612a886b2))

#### 0.0.5 (2020-06-06)

##### New Features

- Add overloads for createStore function ([879f9cd5](https://github.com/JimLiu/atom-state/commit/879f9cd57a6684c6c79492fdfc859e52bf0e48f8))

#### 0.0.4 (2020-06-06)

##### Refactors

- Rename subscribe functions in AtomStore ([cc1b8acd](https://github.com/JimLiu/atom-state/commit/cc1b8acde34462b862a1a410460a16ab98a95c59))

#### 0.0.3 (2020-06-06)

##### Continuous Integration

- publish npm package after tag created ([ca3c651d](https://github.com/JimLiu/atom-state/commit/ca3c651d10fb486fe39b0564c979165446304cfc))

##### Refactors

- Remove duplicate files ([88c7386c](https://github.com/JimLiu/atom-state/commit/88c7386c806a2a316a62a4ef973a04cef9bc2a4b))

#### 0.0.2 (2020-06-06)

##### Refactors

- Remove duplicate files ([88c7386c](https://github.com/JimLiu/atom-state/commit/88c7386c806a2a316a62a4ef973a04cef9bc2a4b))

##### Continuous Integration

- Add github actions ([2ce44966](https://github.com/JimLiu/atom-state/commit/2ce449664862d8d09e062eb9ff506016777f8ed4))

#### 0.0.1 (2020-06-06)

##### New Features

- First version ([dcd9c2df](https://github.com/JimLiu/atom-state/commit/dcd9c2df1d8d333f98180b8626a95058290e0f11))
