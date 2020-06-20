---
title: Core Concepts
sidebar_label: Core Concepts
---

## Overview

Atom-State lets you easily organize and manage the states base on key-value. Atoms are units of state that components can subscribe to, atom could be either synchronous or asynchronous. Selectors can be used to efficiently compute derived data from one or multiple atoms.

## Atoms

Atoms are units of state. Every atom has an unique key and value, value could be either synchronous or asynchronous. Atoms are updateable and subscribable, when an atom is updated either inside of a React componnet or outside of a React component, each subscribed component is re-rendered with the new value.


## Store

Store is the container for all the atoms. You can create, update atoms and subscribe atom changes base on the store.
